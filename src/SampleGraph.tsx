import {
  useLoadGraph,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from "@react-sigma/core";
// import { useLayoutCircular } from "@react-sigma/layout-circular";
import { FC, useEffect, useState } from "react";

export type NodeType = {
  x: number;
  y: number;
  label: string;
  size: number;
  color: string;
  highlighted?: boolean;
};
export type EdgeType = { label: string };

export const SampleGraph: FC<{ disableHoverEffect?: boolean; graph: any }> = ({
  disableHoverEffect,
  graph,
}) => {
  const sigma = useSigma<NodeType, EdgeType>();
  const registerEvents = useRegisterEvents<NodeType, EdgeType>();
  const setSettings = useSetSettings<NodeType, EdgeType>();
  const loadGraph = useLoadGraph<NodeType, EdgeType>();
  // const { assign: assignCircular } = useLayoutCircular();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  /**
   * When component mount
   * => load the graph
   */
  useEffect(() => {
    // Create & load the graph
    if (graph) {
      loadGraph(graph);
    }
    // assignCircular();

    // Register the events
    registerEvents({
      enterNode: (event) => setHoveredNode(event.node),
      leaveNode: () => setHoveredNode(null),
    });
  }, [loadGraph, registerEvents, graph]);

  /**
   * When component mount or hovered node change
   * => Setting the sigma reducers
   */
  useEffect(() => {
    setSettings({
      nodeReducer: (node, data) => {
        const graph = sigma.getGraph();
        const newData = { ...data, highlighted: data.highlighted || false };

        if (!disableHoverEffect && hoveredNode) {
          if (
            node === hoveredNode ||
            graph.neighbors(hoveredNode).includes(node)
          ) {
            newData.highlighted = true;
          } else {
            newData.color = "#E2E2E2";
            newData.highlighted = false;
          }
        }
        return newData;
      },
      edgeReducer: (edge, data) => {
        const graph = sigma.getGraph();
        const newData = { ...data, hidden: false };

        if (
          !disableHoverEffect &&
          hoveredNode &&
          !graph.extremities(edge).includes(hoveredNode)
        ) {
          newData.hidden = true;
        }
        return newData;
      },
    });
  }, [hoveredNode, setSettings, sigma, disableHoverEffect]);

  return null;
};
