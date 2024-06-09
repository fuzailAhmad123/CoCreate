import React, {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import rough from "roughjs";
import {
  setElements,
  setAction,
  setSelectedElement,
  setSelectedTool,
} from "../../../slices/toolSlice";
import { getStroke } from "perfect-freehand";

const roughGenerator = rough.generator();
const usePressedKeys = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPressedKeys((prevKeys) => new Set(prevKeys).add(event.key));
    };

    const handleKeyUp = (event) => {
      setPressedKeys((prevKeys) => {
        const updatedKeys = new Set(prevKeys);
        updatedKeys.delete(event.key);
        return updatedKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return pressedKeys;
};

const Canvas = ({
  canvasRef,
  ctxRef,
  state,
  setState,
  scale,
  setScale,
  scaleOffset,
  setScaleOffset,
  user,
  pathName,
  socket,
}) => {
  const dispatch = useDispatch();
  const { action, elements, selectedTool, selectedElement, keepToolActive } =
    useSelector((state) => state.tool);
  const { canvasColor } = useSelector((state) => state.theme);
  const [shouldCapture, setShouldCapture] = useState(false);
  const [panOffSet, setPanOffSet] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const textAreaRef = useRef();
  const pressedKeys = usePressedKeys();

  const {
    strokeColor,
    strokeWidth,
    backgroundColor,
    backgroundHachureFill,
    sloppiness,
    strokeStyle,
  } = useSelector((state) => state.style);

  // setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const ctx = canvas.getContext("2d");

    ctxRef.current = ctx;
  }, []);

  //handle text area
  const handleBlur = (e) => {
    const { id, x1, y1, type } = selectedElement;

    if (e.target.value !== "") {
      let copiedElements = [...state.history[state.index]];
      const index = copiedElements.length - 1;
      const textWidth = canvasRef.current
        .getContext("2d")
        .measureText(e.target.value).width;
      const textHeight = 20;
      const updatedElement = createElement(
        id,
        x1,
        y1,
        x1 + textWidth,
        y1 + textHeight,
        [],
        "text",
        null,
        e.target.value
      );

      copiedElements[id] = updatedElement;
      setState((prevState) => ({
        ...prevState,
        history: [
          ...prevState.history.slice(0, prevState.index),
          copiedElements,
        ],
      }));

      dispatch(setAction("none"));
      dispatch(setSelectedElement(null));
    }
  };

  useEffect(() => {
    const panFunction = (event) => {
      setPanOffSet((prev) => ({
        x: prev.x - event.deltaX,
        y: prev.y - event.deltaY,
      }));
    };
    document.addEventListener("wheel", panFunction);
    return () => {
      document.removeEventListener("wheel", panFunction);
    };
  }, [pressedKeys]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      textArea.focus();
      textArea.value = selectedElement.text;
    }
  }, [selectedElement, action]);

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);

    // Clear the canvas before drawing again
    if (ctxRef.current && state.history[state.index].length > 0) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    const context = canvasRef.current.getContext("2d");

    //get height and width for zoomed screens
    const scaledWidth = canvasRef.current.width * scale;
    const scaledHeight = canvasRef.current.height * scale;

    //get scaled offsets for zoomed screens
    const scaleOffsetX = (scaledWidth - canvasRef.current.width) / 2;
    const scaleOffsetY = (scaledHeight - canvasRef.current.height) / 2;
    // setScaleOffset({x:scaleOffsetX, y:scaleOffsetY});

    // Only update scaleOffset if it has changed
    if (scaleOffset.x !== scaleOffsetX || scaleOffset.y !== scaleOffsetY) {
      setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });
    }
    //save snapshot
    context.save();
    context.translate(
      panOffSet.x * scale - scaleOffsetX,
      panOffSet.y * scale - scaleOffsetY
    );
    context.scale(scale, scale);

    // Draw elements on canvas
    state.history[state.index].forEach((element) => {
      if (action === "writing" && selectedElement.id === element.id) {
        return;
      }

      // Drawing for pencil
      if (element.type === "pencil") {
        // const myPath = new Path2D(element.pathData)
        // ctxRef.current.fill(myPath)
        const myPath = new Path2D(element.pathData);
        ctxRef.current.strokeStyle = element.options.color; // Set stroke color
        ctxRef.current.lineWidth = element.options.size; // Set stroke size
        ctxRef.current.stroke(myPath);
      } else if (element.type === "text") {
        // Store current fillStyle
        const previousFillStyle = ctxRef.current.fillStyle;

        // Set color for text explicitly
        ctxRef.current.fillStyle = element.options.color;
        ctxRef.current.font = `${element.options.fontWeight} ${
          20 * scale
        }px virgil`;
        ctxRef.current.textBaseline = "top";
        ctxRef.current.fillText(element.text, element.x1, element.y1);

        // Restore previous fillStyle
        ctxRef.current.fillStyle = previousFillStyle;
      } else {
        roughCanvas.draw(element.roughElement);
      }
    });

    //restore snapshot after changes
    context.restore();

    //create a data url and send it to backend also

    if (user?.presenter === true && pathName !== "/") {
      const canvasImage = canvasRef.current.toDataURL();
      socket.emit("whiteboardData", canvasImage);
    }
  }, [state.index, state.history, action, selectedElement, panOffSet, scale]);

  //create a single element
  function createElement(
    id,
    x1,
    y1,
    x2,
    y2,
    path,
    type = null,
    elementOption = null,
    text = null
  ) {
    let roughElement = null;
    const tool = type === null ? selectedTool : type;
    const options = {
      stroke: strokeColor,
      strokeWidth: strokeWidth,
      roughness: sloppiness,
      fill: backgroundColor,
      fillStyle: backgroundHachureFill,
      fillWeight: 2,
      hachureAngle: 60, // angle of hachure,
      hachureGap: 5,
      strokeLineDash: strokeStyle,
      bowing: 3,
    };
    switch (tool) {
      case "pencil":
        const newOptions =
          elementOption === null
            ? {
                size: strokeWidth === 1 ? 6 : strokeWidth === 3 ? 10 : 15,
                thinning: 0.5,
                smoothing: 0.5,
                streamline: 0.5,
              }
            : elementOption;
        const outlinePoints = getStroke(path, newOptions);
        const pathData = getSvgPathFromStroke(outlinePoints);
        return {
          id,
          type: type === null ? selectedTool : type,
          x1,
          y1,
          x2,
          y2,
          path,
          pathData: pathData,
          options:
            elementOption === null
              ? {
                  size: strokeWidth === 1 ? 6 : strokeWidth === 3 ? 10 : 15,
                  thinning: 0.5,
                  smoothing: 0.5,
                  streamline: 0.5,
                  color: strokeColor,
                }
              : elementOption,
        };
      case "line":
        roughElement = roughGenerator.line(
          x1,
          y1,
          x2,
          y2,
          elementOption === null
            ? {
                stroke: strokeColor,
                strokeWidth: strokeWidth,
                roughness: sloppiness,
                strokeLineDash: strokeStyle,
              }
            : elementOption
        );
        return {
          id,
          type: type === null ? selectedTool : type,
          x1,
          y1,
          x2,
          y2,
          options:
            elementOption === null
              ? {
                  stroke: strokeColor,
                  strokeWidth: strokeWidth,
                  roughness: sloppiness,
                  strokeLineDash: strokeStyle,
                }
              : elementOption,
          roughElement,
        };
      case "rectangle":
        roughElement = roughGenerator.rectangle(
          x1,
          y1,
          x2 - x1,
          y2 - y1,
          elementOption === null ? options : elementOption
        );
        return {
          id,
          type: type === null ? selectedTool : type,
          x1,
          y1,
          x2,
          y2,
          options: elementOption === null ? options : elementOption,
          roughElement,
        };
      case "circle":
        roughElement = roughGenerator.ellipse(
          x1,
          y1,
          2 * (x2 - x1),
          2 * (y2 - y1),
          elementOption === null ? options : elementOption
        );
        return {
          id,
          type: type === null ? selectedTool : type,
          x1,
          y1,
          x2,
          y2,
          rX: x2 - x1,
          rY: y2 - y1,
          options: elementOption === null ? options : elementOption,
          roughElement,
        };
      case "rhombus":
        roughElement = roughGenerator.polygon(
          [
            [x1 - (x2 - x1), y1],
            [x1, y1 + (y2 - y1)],
            [x1 + (x2 - x1), y1],
            [x1, y1 - (y2 - y1)],
          ],
          elementOption === null ? options : elementOption
        );
        return {
          id,
          type: type === null ? selectedTool : type,
          x1,
          y1,
          x2,
          y2,
          points: [
            [x1 - (x2 - x1), y1],
            [x1, y1 + (y2 - y1)],
            [x1 + (x2 - x1), y1],
            [x1, y1 - (y2 - y1)],
          ],
          options: elementOption === null ? options : elementOption,
          roughElement,
        };
      case "text":
        return {
          id,
          type: type === null ? selectedTool : type,
          x1,
          y1,
          x2,
          y2,
          text: text === null ? "" : text,
          options:
            elementOption === null
              ? {
                  color: strokeColor,
                  fontWeight:
                    strokeWidth === 1
                      ? "normal"
                      : strokeWidth === 3
                      ? "bold"
                      : "bolder",
                }
              : elementOption,
        };
      case "arrow":
        return;
    }
  }

  // func to handle mouse down
  const handleMouseDown = (e) => {
    //do nothing if writing
    if (action === "writing") return;

    const { offsetX, offsetY } = getAdjustedCoordinates(e.nativeEvent);

    //if panning tool is active
    if (e.button === 1 || pressedKeys.has(" ") || selectedTool === "hand") {
      setAction("panning");
      setStartPanMousePosition({ x: offsetX, y: offsetY });
      return;
    }

    if (selectedTool === "cursor") {
      const element = getElementAtPosition(
        offsetX,
        offsetY,
        state.history[state.index]
      );

      if (element) {
        const OffsetX = offsetX - element.x1;
        const OffsetY = offsetY - element.y1;

        dispatch(setSelectedElement({ ...element, OffsetX, OffsetY }));
        if (element.position === "inside") {
          dispatch(setAction("moving"));
        } else {
          dispatch(setAction("resizing"));
        }

        // Create a new snapshot for moving or resizing
        const copiedElements = [...state.history[state.index]];
        setState((prevState) => ({
          ...prevState,
          history: [
            ...prevState.history.slice(0, prevState.index + 1),
            copiedElements,
          ],
          index: prevState.index + 1,
        }));

        setShouldCapture(true);
      }
    } else {
      setShouldCapture(true);
      dispatch(setAction(selectedTool === "text" ? "writing" : "drawing"));
      const id = state.history[state.index].length;
      let newElement;
      if (selectedTool === "pencil") {
        const path = [[offsetX, offsetY]];
        newElement = createElement(
          id,
          offsetX,
          offsetY,
          offsetX,
          offsetY,
          path
        );
      } else {
        newElement = createElement(id, offsetX, offsetY, offsetX, offsetY);
        if (selectedTool === "text") {
          dispatch(setSelectedElement({ ...newElement, offsetX, offsetY }));
        }
      }

      const newElements = [...state.history[state.index], newElement];
      setState((prevState) => ({
        ...prevState,
        history: [
          ...prevState.history.slice(0, prevState.index + 1),
          newElements,
        ],
        index: prevState.index + 1,
      }));
      localStorage.setItem("elements", JSON.stringify(newElements));
    }
  };

  //func to handle mouse move
  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = getAdjustedCoordinates(e.nativeEvent);

    if (action === "panning" || selectedTool === "hand") {
      const deltaX = offsetX - startPanMousePosition.x;
      const deltaY = offsetY - startPanMousePosition.y;
      setPanOffSet((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      e.target.style.cursor = "grab";
      return;
    }

    let copiedElements = [...state.history[state.index]];

    if (selectedTool !== "cursor" && selectedTool !== "hand") {
      e.target.style.cursor = "crosshair";
    } else if (selectedTool === "cursor") {
      const element = getElementAtPosition(
        offsetX,
        offsetY,
        state.history[state.index]
      );
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (shouldCapture) {
      if (action === "drawing") {
        const index = copiedElements.length - 1;
        if (selectedTool === "pencil") {
          const { x1, y1, path, options, type } = copiedElements[index];
          const newPath = [...path, [offsetX, offsetY]];
          const updatedElement = createElement(
            index,
            x1,
            y1,
            offsetX,
            offsetY,
            newPath,
            type,
            options
          );
          copiedElements[index] = updatedElement;
        } else {
          const { x1, y1 } = copiedElements[index];
          const updatedElement = createElement(index, x1, y1, offsetX, offsetY);
          copiedElements[index] = updatedElement;
        }
        setState((prevState) => ({
          ...prevState,
          history: [
            ...prevState.history.slice(0, prevState.index),
            copiedElements,
          ],
        }));
      } else if (action === "moving" || action === "resizing") {
        const { id, x1, x2, y1, y2, type, OffsetX, OffsetY, options } =
          selectedElement;
        if (action === "moving") {
          if (type !== "pencil" && type !== "text") {
            const width = x2 - x1;
            const height = y2 - y1;
            const newX1 = offsetX - OffsetX;
            const newY1 = offsetY - OffsetY;
            const updatedElement = createElement(
              id,
              newX1,
              newY1,
              newX1 + width,
              newY1 + height,
              null,
              type,
              options
            );
            copiedElements[id] = updatedElement;
          } else if (type === "text") {
            const { text } = selectedElement;
            const width = x2 - x1;
            const height = y2 - y1;
            const newX1 = offsetX - OffsetX;
            const newY1 = offsetY - OffsetY;
            const updatedElement = createElement(
              id,
              newX1,
              newY1,
              newX1 + width,
              newY1 + height,
              [],
              type,
              options,
              text
            );
            copiedElements[id] = updatedElement;
          } else {
            const dx = offsetX - OffsetX - x1;
            const dy = offsetY - OffsetY - y1;
            const newPath = selectedElement.path.map(([x, y]) => [
              x + dx,
              y + dy,
            ]);
            const updatedElement = createElement(
              id,
              offsetX - OffsetX,
              offsetY - OffsetY,
              x2 + dx,
              y2 + dy,
              newPath,
              type,
              options
            );
            copiedElements[id] = updatedElement;
          }
        } else if (action === "resizing") {
          const { id, position, type, options, x1, y1, x2, y2 } =
            selectedElement;
          const { newX1, newY1, newX2, newY2 } = getResizedCoordinates(
            x1,
            x2,
            y1,
            y2,
            position,
            offsetX,
            offsetY
          );
          const updatedElement = createElement(
            id,
            newX1,
            newY1,
            newX2,
            newY2,
            null,
            type,
            options
          );
          copiedElements[id] = updatedElement;
        }
        setState((prevState) => ({
          ...prevState,
          history: [
            ...prevState.history.slice(0, prevState.index),
            copiedElements,
          ],
        }));
      }
      localStorage.setItem("elements", JSON.stringify(copiedElements));
    }
  };

  //func to handle mouse up
  const handleMouseUp = (e) => {
    const { offsetX, offsetY } = getAdjustedCoordinates(e.nativeEvent);
    // const { offsetX, offsetY } = e.nativeEvent;
    const index = state.history[state.index].length - 1;
    let copiedElements = [...state.history[state.index]];
    const { id, type, options } = copiedElements[index];

    if (action === "drawing" && type !== "pencil") {
      const { x1, y1, x2, y2 } = adjustElementCoordinates(
        copiedElements[index]
      );
      // Update width and height and update the element.
      const updatedElement = createElement(
        id,
        x1,
        y1,
        x2,
        y2,
        [],
        type,
        options
      );
      copiedElements[index] = updatedElement;
    }

    setState((prevState) => ({
      ...prevState,
      history: [
        ...prevState.history.slice(0, prevState.index + 1),
        copiedElements,
      ],
      index: prevState.index + 1,
    }));
    localStorage.setItem("elements", JSON.stringify(copiedElements));

    if (action === "writing") {
      return;
    }

    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        offsetX - selectedElement.OffsetX === selectedElement.x1 &&
        offsetY - selectedElement.OffsetY === selectedElement.y1
      ) {
        dispatch(setAction("writing"));
        return;
      }
    }

    dispatch(setAction("none"));
    dispatch(setSelectedElement(null));
    setShouldCapture(false);

    if (keepToolActive !== true) {
      dispatch(setSelectedTool("cursor"));
    } else {
      return;
    }
  };

  //func to get ele at cursor position
  const getElementAtPosition = (x, y, elements) => {
    return elements
      .map((element) => ({
        ...element,
        position: positionWithInElement(x, y, element),
      }))
      .find((element) => element.position !== null);
  };

  //func to get info about cursor within the element
  const positionWithInElement = (x, y, element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    } else if (type === "line") {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x, y };
      const offSet = distance(a, b) - (distance(a, c) + distance(b, c));
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      const inside = Math.abs(offSet) < 1 ? "inside" : null;
      return start || end || inside;
    } else if (type === "rhombus") {
      const { points } = element;
      const isInside = pointInPolygon(x, y, points) ? "inside" : null;
      const topLeft = nearPoint(x, y, points[0][0], points[0][1], "tl");
      const bottomLeft = nearPoint(x, y, points[1][0], points[1][1], "bl");
      const bottomRight = nearPoint(x, y, points[2][0], points[2][1], "br");
      const topRight = nearPoint(x, y, points[3][0], points[3][1], "tr");
      return topLeft || topRight || bottomLeft || bottomRight || isInside;
    } else if (type === "circle") {
      const { rX, rY } = element;
      const radX = rX;
      const radY = rY; // rX and rY are the horizontal and vertical radii
      const dx = x - x1;
      const dy = y - y1;
      const ellipseEquation =
        (dx * dx) / (radX * radX) + (dy * dy) / (radY * radY);
      if (Math.abs(ellipseEquation - 1) < 0.09) {
        // Allow a small tolerance for floating point comparison
        console.log("cr");
        return "cr"; // On the circumference
      }
      return ellipseEquation < 1 ? "inside" : null; // Inside the ellipse
    } else if (type === "pencil") {
      const { path } = element;
      const modifiedPath = getModifiedPath(path);
      return isWithinPencilPath(x, y, modifiedPath);
    } else if (type === "text") {
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    }
  };

  //func to check point on line
  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  // Function to check if a point is inside a polygon
  const pointInPolygon = (x, y, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  //func to get updated path
  const getModifiedPath = (path) => {
    const modifiedPath = [];
    for (let i = 0; i < path.length - 1; i++) {
      const startPoint = path[i];
      const endPoint = path[i + 1];
      modifiedPath.push({
        x1: startPoint[0],
        y1: startPoint[1],
        x2: endPoint[0],
        y2: endPoint[1],
      });
    }

    return modifiedPath;
  };

  // Function to check if a point is on a pencil path
  const isWithinPencilPath = (x, y, path) => {
    const tolerance = 1; // Tolerance for distance check
    for (let i = 0; i < path.length - 1; i++) {
      const { x1, y1, x2, y2 } = path[i];
      const d = pointToLineDistance(x, y, x1, y1, x2, y2);
      if (d <= tolerance) return "inside";
    }
    return null;
  };

  // Function to calculate distance from a point to a line
  const pointToLineDistance = (x, y, x1, y1, x2, y2) => {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  //func to get the updated path
  const getUpdatedPath = (x, y, path) => {
    const updatedPath = path.map((vertex) => {
      return [vertex[0] + x, vertex[1] + y];
    });
    return updatedPath;
  };

  //adjust the coordinates of element on cursor movement
  const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;

    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, x2: maxX, y1: minY, y2: maxY };
    } else if (type === "line") {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    } else {
      return { x1, x2, y1, y2 };
    }
  };

  //func to get nearest vertex to the cursor
  const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
  };

  //cursor style depending upon the position relative to vertex
  const cursorForPosition = (position) => {
    switch (position) {
      case "tl":
      case "br":
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      case "cr":
        return "ew-resize";
      default:
        return "move";
    }
  };

  //get updated coordinates of the app
  const getResizedCoordinates = (
    x1,
    x2,
    y1,
    y2,
    position,
    offsetX,
    offsetY
  ) => {
    switch (position) {
      case "tl":
      case "start":
        return { newX1: offsetX, newY1: offsetY, newX2: x2, newY2: y2 };
      case "tr":
        return { newX1: x1, newY1: offsetY, newX2: offsetX, newY2: y2 };
      case "bl":
        return { newX1: offsetX, newY1: y1, newX2: x2, newY2: offsetY };
      case "br":
      case "end":
        return { newX1: x1, newY1: y1, newX2: offsetX, newY2: offsetY };
      case "cr":
        return { newX1: x1, newY1: y1, newX2: offsetX, newY2: offsetY };
      default:
        return null;
    }
  };

  //to get svg Path for pencil
  function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return "";

    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
  }

  // Utility function to normalize coordinates
const getEventCoordinates = (event) => {
  if (event.touches && event.touches.length > 0) {
    return {
      rawX: event.touches[0].clientX,
      rawY: event.touches[0].clientY,
    };
  } else {
    return {
      rawX: event.offsetX,
      rawY: event.offsetY,
    };
  }
};
  //func to get mouse coordinates
  const getAdjustedCoordinates = (event) => {
      // Get raw mouse or touch coordinates .
    const { rawX, rawY } = getEventCoordinates(event);
    
    // const rawX = event.offsetX;
    // const rawY = event.offsetY;

    // Adjust coordinates based on panning offset
    const offsetX = (rawX - panOffSet.x * scale + scaleOffset.x) / scale;
    const offsetY = (rawY - panOffSet.y * scale + scaleOffset.y) / scale;

    return { offsetX, offsetY };
  };

    return (
      <>
        {action === "writing" && (
          <textarea
            onBlur={handleBlur}
            ref={textAreaRef}
            placeholder="Start typing here..."
            className={` min-w-[180px] h-[30px] bg-transparent placeholder:text-grey-50 virgil`}
            style={{
              position: "fixed",
              top:
                (selectedElement.y1 - 8) * scale +
                panOffSet.y * scale -
                scaleOffset.y,
              left:
                (selectedElement.x1 + 2) * scale +
                panOffSet.x * scale -
                scaleOffset.x,
              color: selectedElement.options.color,
              fontWeight: selectedElement.options.fontWeight,
              margin: 0,
              padding: 0,
              border: 0,
              outline: 0,
              resize: "auto",
              overflow: "hidden",
              font: `${20 * scale}px`,
              width: canvasRef.current
                .getContext("2d")
                .measureText(selectedElement.text).width,
            }}
          ></textarea>
        )}

        <canvas
          id="canvas"
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={(e) => handleMouseDown(e.touches[0])}
          onTouchMove={(e) => handleMouseMove(e.touches[0])}
          onTouchEnd={(e) => handleMouseUp(e.changedTouches[0])}
          className={` bg-white dark:bg-black-25`}
          style={{
            backgroundColor: canvasColor,
          }}
        ></canvas>
      </>
    );
  
};

export default Canvas;
