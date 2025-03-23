import React, { useState, useEffect } from "react";
import { Offcanvas, Button, Form, Table } from "react-bootstrap";

interface Triple {
  subject: string;
  predicate: string;
  object: string;
}

interface TripleEditorOverlayProps {
  show: boolean;
  triplets: Triple[];
  onSave: (updatedTriples: Triple[]) => void;
  onClose: () => void;
}

const TripleEditorOverlay: React.FC<TripleEditorOverlayProps> = ({
  show,
  triplets,
  onSave,
  onClose,
}) => {
  const [editedTriples, setEditedTriples] = useState<Triple[]>([]);

  // Update the state when triplets prop changes
  useEffect(() => {
    if (show) {
      setEditedTriples(triplets);
    }
  }, [triplets, show]);

  const handleChange = (index: number, field: keyof Triple, value: string) => {
    const updatedTriples = [...editedTriples];
    updatedTriples[index] = { ...updatedTriples[index], [field]: value };
    setEditedTriples(updatedTriples);
  };

  return (
    <Offcanvas show={show} onHide={onClose} placement="end" backdrop={false}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit RDF Triplets</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {editedTriples.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Predicate</th>
                <th>Object</th>
              </tr>
            </thead>
            <tbody>
              {editedTriples.map((triple, index) => (
                <tr key={index}>
                  <td>
                    <Form.Control
                      type="text"
                      value={triple.subject}
                      onChange={(e) =>
                        handleChange(index, "subject", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={triple.predicate}
                      onChange={(e) =>
                        handleChange(index, "predicate", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={triple.object}
                      onChange={(e) =>
                        handleChange(index, "object", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No triplets available.</p>
        )}

        {/* Save & Close Buttons */}
        <div className="d-flex justify-content-end mt-3">
          <Button
            variant="success"
            onClick={() => onSave(editedTriples)}
            className="me-2"
          >
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default TripleEditorOverlay;
