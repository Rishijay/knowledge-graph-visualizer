import React, { useEffect, useState } from "react";
import {
  SigmaContainer,
  useRegisterEvents,
  useSigma,
  ControlsContainer,
  FullScreenControl,
  ZoomControl,
} from "@react-sigma/core";
import { MultiDirectedGraph } from "graphology";
import * as rdf from "rdflib";
import "@react-sigma/core/lib/style.css";
import { SampleGraph } from "./SampleGraph";

const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  useEffect(() => {
    registerEvents({
      downNode: (e) => {
        setDraggedNode(e.node);
        sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
      },
      mousemovebody: (e) => {
        if (!draggedNode) return;
        const pos = sigma.viewportToGraph(e);
        sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
        sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

        e.preventSigmaDefault();
        e.original.preventDefault();
        e.original.stopPropagation();
      },
      mouseup: () => {
        if (draggedNode) {
          setDraggedNode(null);
          sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
        }
      },
      mousedown: () => {
        if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
      },
    });
  }, [registerEvents, sigma, draggedNode]);

  return null;
};

const GraphRenderer = ({ ttlUrl }: { ttlUrl: string }) => {
  const [graph, setGraph] = useState<MultiDirectedGraph | null>(null);

  const createGraph = (grph: any) => {
    const graph = new MultiDirectedGraph();
    grph.nodes.forEach((n: any) => {
      const attributes = n.attributes;
      graph.addNode(n.key, {
        x: attributes.x,
        y: attributes.y,
        label: attributes.label,
        size: attributes.size + 3,
        color: "#" + Math.random().toString(16).substr(-6),
      });
    });

    grph.edges.forEach((e: any, index: number) => {
      const attributes = e.attributes;
      graph.addEdge(e.source, e.target, {
        id: index,
        source: e.source,
        target: e.target,
        label: attributes.label,
        color: "#878686",
      });
    });

    setGraph(graph);
  };

  useEffect(() => {
    const fetchAndParseTTL = async (url: string) => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          setGraph(null);
          alert(
            `HTTP status: ${response.status}\nError fetching TTL file. Please check the URL/CORS and try again.`
          );
          return;
        }

        const ttlData = await response.text();

        const store = rdf.graph();
        rdf.parse(ttlData, store, url, "text/turtle");

        const newGraph = new MultiDirectedGraph();
        const nodes = new Set<string>();

        const sanitizeID = (value: string) =>
          value.replace(/^http:\/\/\S+\//, "").replace(/[^a-zA-Z0-9_-]/g, "_");

        store.statements.forEach((quad) => {
          let subject = sanitizeID(quad.subject.value);
          let predicate = sanitizeID(quad.predicate.value);
          let object = sanitizeID(quad.object.value);

          if (!subject || !object || !predicate) return;

          if (!nodes.has(subject)) {
            newGraph.addNode(subject, {
              label: subject.replace(/_/g, " "),
              size: 10,
              x: Math.random() * 100,
              y: Math.random() * 100,
            });
            nodes.add(subject);
          }

          if (!nodes.has(object)) {
            newGraph.addNode(object, {
              label: object.replace(/_/g, " "),
              size: 10,
              x: Math.random() * 100,
              y: Math.random() * 100,
            });
            nodes.add(object);
          }

          const edgeKey = `${subject}->${object}`;
          if (!newGraph.hasEdge(edgeKey)) {
            newGraph.addEdgeWithKey(edgeKey, subject, object, {
              label: predicate.replace(/_/g, " "),
            });
          }
        });

        createGraph(newGraph.export());
      } catch (error) {
        console.error("Error fetching or parsing TTL:", error);
      }
    };

    if (ttlUrl) {
      fetchAndParseTTL(ttlUrl);
    }
  }, [ttlUrl]);

  return graph ? (
    <SigmaContainer
      style={{
        width: "100%",
        height: "80vh",
        marginRight: 10,
        border: "1px solid black",
      }}
      settings={{
        allowInvalidContainer: true,
        renderEdgeLabels: true,
      }}
    >
      <SampleGraph disableHoverEffect graph={graph} />
      <GraphEvents />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <FullScreenControl />
      </ControlsContainer>
    </SigmaContainer>
  ) : (
    <p>Loading graph...</p>
  );
};

export default GraphRenderer;
