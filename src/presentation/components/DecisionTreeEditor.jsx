import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  EdgeLabelRenderer,
  BaseEdge,
  getBezierPath,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Button, Typography, Tooltip } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import LinkIcon from '@mui/icons-material/Link';

// ─── Format detection & conversion (old tree → React Flow) ────────────────────

const isOldFormat = (data) =>
  data && typeof data.nodes === 'object' && !Array.isArray(data.nodes) && data.rootId;

const convertOldTree = (tree) => {
  if (!tree?.rootId || !tree?.nodes) return { nodes: [], edges: [] };
  const rfNodes = [];
  const rfEdges = [];
  let edgeIdx = 0;
  const queue = [{ id: tree.rootId, x: 250, y: 40 }];
  const visited = new Set();

  while (queue.length) {
    const { id, x, y } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    const node = tree.nodes[id];
    if (!node) continue;
    const isLeaf = !node.branches?.length;
    rfNodes.push({
      id,
      type: isLeaf ? 'terminal' : 'decision',
      position: { x, y },
      data: { label: node.text || '' },
    });
    (node.branches || []).forEach((branch, i) => {
      rfEdges.push({ id: `e-${edgeIdx++}`, source: id, target: branch.nextId, label: branch.label || '', type: 'editableEdge' });
      const spread = (node.branches.length - 1) * 140;
      queue.push({ id: branch.nextId, x: x - spread / 2 + i * 140, y: y + 130 });
    });
  }
  return { nodes: rfNodes, edges: rfEdges };
};

const normalizeData = (initialData, tree) => {
  const raw = initialData ?? tree ?? null;
  if (!raw) return { nodes: [], edges: [] };
  if (Array.isArray(raw.nodes)) return raw;
  if (isOldFormat(raw)) return convertOldTree(raw);
  return { nodes: [], edges: [] };
};

// ─── Editable label (shared by custom nodes) ──────────────────────────────────

const EditableLabel = ({ id, label, updateNodeData, color }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(label ?? '');

  useEffect(() => { if (!editing) setVal(label ?? ''); }, [label, editing]);

  const commit = () => {
    setEditing(false);
    updateNodeData(id, { label: val });
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            else if (e.key === 'Escape') { setEditing(false); setVal(label ?? ''); }
          }}
        onClick={(e) => e.stopPropagation()}
        style={{ width: '80%', fontSize: 11, border: 'none', outline: `2px solid ${color}`, borderRadius: 2, textAlign: 'center', padding: '2px 4px', background: 'white', fontFamily: 'inherit' }}
      />
    );
  }
  return (
    <span
      role="button"
      tabIndex={0}
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setEditing(true); } }}
      title="Doble clic para editar"
      style={{ color: val ? '#1a1a1a' : '#bbb', textAlign: 'center', padding: '0 8px', wordBreak: 'break-word', lineHeight: 1.3, fontSize: 11, fontFamily: 'inherit', cursor: 'text' }}
    >
      {val || 'Doble clic para editar'}
    </span>
  );
};

EditableLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  updateNodeData: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
};

// Shared handle style — 14px dot with white ring for visibility and larger hitbox.
const hs = (color, extra = {}) => ({
  background: color, width: 14, height: 14,
  border: '2.5px solid #fff', boxShadow: `0 0 0 1.5px ${color}`,
  borderRadius: '50%', ...extra,
});

// ─── Custom node: Nodo (óvalo / elipse) ───────────────────────────────────────

const DecisionNode = ({ data, id, selected }) => {
  const { updateNodeData } = useReactFlow();
  return (
    <div style={{
      width: 140, height: 70,
      background: '#e3f2fd', border: `2px solid ${selected ? '#001f56' : '#1976d2'}`,
      borderRadius: '50%', boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: selected ? '0 0 0 2px #001f56' : 'none',
    }}>
      <EditableLabel id={id} label={data.label} updateNodeData={updateNodeData} color="#1976d2" />
      <Handle type="source" position={Position.Top}    style={hs('#1976d2')} />
      <Handle type="source" position={Position.Bottom} id="b" style={hs('#1976d2')} />
      <Handle type="source" position={Position.Left}   id="l" style={hs('#1976d2')} />
      <Handle type="source" position={Position.Right}  id="r" style={hs('#1976d2')} />
    </div>
  );
};

DecisionNode.propTypes = {
  data: PropTypes.shape({ label: PropTypes.string }),
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

// ─── Custom node: Proceso (rectángulo) ────────────────────────────────────────

const ProcessNode = ({ data, id, selected }) => {
  const { updateNodeData } = useReactFlow();
  return (
    <div style={{
      width: 150, height: 60,
      background: '#e8f5e9', border: `2px solid ${selected ? '#001f56' : '#2e7d32'}`,
      borderRadius: 4, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: selected ? '0 0 0 2px #001f56' : 'none',
    }}>
      <EditableLabel id={id} label={data.label} updateNodeData={updateNodeData} color="#2e7d32" />
      <Handle type="source" position={Position.Top}    style={hs('#2e7d32')} />
      <Handle type="source" position={Position.Bottom} id="b" style={hs('#2e7d32')} />
      <Handle type="source" position={Position.Left}   id="l" style={hs('#2e7d32')} />
      <Handle type="source" position={Position.Right}  id="r" style={hs('#2e7d32')} />
    </div>
  );
};

ProcessNode.propTypes = {
  data: PropTypes.shape({ label: PropTypes.string }),
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

// ─── Custom node: Hoja (rectángulo redondeado) ────────────────────────────────

const TerminalNode = ({ data, id, selected }) => {
  const { updateNodeData } = useReactFlow();
  return (
    <div style={{
      width: 130, height: 50,
      background: '#f5f5f5', border: `2px solid ${selected ? '#001f56' : '#616161'}`,
      borderRadius: 25, boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: selected ? '0 0 0 2px #001f56' : 'none',
    }}>
      <EditableLabel id={id} label={data.label} updateNodeData={updateNodeData} color="#616161" />
      <Handle type="source" position={Position.Top}    style={hs('#616161')} />
      <Handle type="source" position={Position.Bottom} id="b" style={hs('#616161')} />
      <Handle type="source" position={Position.Left}   id="l" style={hs('#616161')} />
      <Handle type="source" position={Position.Right}  id="r" style={hs('#616161')} />
    </div>
  );
};

TerminalNode.propTypes = {
  data: PropTypes.shape({ label: PropTypes.string }),
  id: PropTypes.string.isRequired,
  selected: PropTypes.bool,
};

// ─── Custom edge con etiqueta editable ────────────────────────────────────────

const EditableEdge = ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, label, selected, markerEnd }) => {
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const { setEdges } = useReactFlow();
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(label || '');

  useEffect(() => { if (!editing) setEditLabel(label || ''); }, [label, editing]);

  const commit = () => {
    setEditing(false);
    setEdges((es) => es.map((e) => (e.id === id ? { ...e, label: editLabel } : e)));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={{ stroke: selected ? '#001f56' : '#94a3b8', strokeWidth: 2 }} />
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan"
          role="button"
          tabIndex={0}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setEditing(true); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); setEditing(true); } }}
          title="Clic para editar etiqueta"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: '#fff',
            border: `1px solid ${selected ? '#001f56' : '#94a3b8'}`,
            borderRadius: 4, padding: '2px 8px', fontSize: 11,
            cursor: 'text', minWidth: 40, textAlign: 'center',
            fontFamily: 'inherit', pointerEvents: 'all',
          }}
        >
          {editing ? (
            <input
              autoFocus value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
              onBlur={commit}
              onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setEditLabel(label || ''); } }}
              style={{ width: 80, fontSize: 11, border: 'none', outline: 'none', fontFamily: 'inherit' }}
            />
          ) : (
            <span style={{ color: editLabel ? '#374151' : '#9ca3af', fontStyle: editLabel ? 'normal' : 'italic' }}>{editLabel || 'etiqueta'}</span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

EditableEdge.propTypes = {
  id: PropTypes.string.isRequired,
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  sourcePosition: PropTypes.string.isRequired,
  targetPosition: PropTypes.string.isRequired,
  label: PropTypes.string,
  selected: PropTypes.bool,
  markerEnd: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

// ─── Mapas de tipos (fuera del componente para evitar recrearlos) ─────────────

const nodeTypes = { decision: DecisionNode, process: ProcessNode, terminal: TerminalNode };
const edgeTypes = { editableEdge: EditableEdge };
const defaultEdgeOptions = { type: 'editableEdge', markerEnd: { type: MarkerType.ArrowClosed } };

let _counter = Date.now();
const uid = () => `rf-${_counter++}`;

// ─── Editor interno (requiere estar dentro de ReactFlowProvider) ──────────────

const EditorInner = ({ initialData, onChange, readOnly }) => {
  const { nodes: initNodes, edges: initEdges } = normalizeData(initialData, null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);
  const [connectMode, setConnectMode] = useState(false);

  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  // Notificar al padre cuando cambia el árbol (skip el primer render)
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return; }
    onChangeRef.current?.({ nodes, edges });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const onConnect = useCallback((params) => {
    setEdges((prev) => addEdge({ ...params, id: uid(), label: '', type: 'editableEdge', markerEnd: { type: MarkerType.ArrowClosed } }, prev));
  }, [setEdges]);

  const addNode = useCallback((type) => {
    setNodes((prev) => [
      ...prev,
      { id: uid(), type, position: { x: 80 + Math.random() * 320, y: 40 + Math.random() * 220 }, data: { label: '' } },
    ]);
  }, [setNodes]);

  const deleteSelected = useCallback(() => {
    setNodes((ns) => ns.filter((n) => !n.selected));
    setEdges((es) => es.filter((e) => !e.selected));
  }, [setNodes, setEdges]);

  const clearAll = useCallback(() => { setNodes([]); setEdges([]); }, [setNodes, setEdges]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 500, border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
      {/* Toolbar */}
      {!readOnly && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 0.75, borderBottom: '1px solid #e0e0e0', bgcolor: '#fff', flexWrap: 'wrap' }}>
          <Typography variant="caption" sx={{ color: '#555', fontWeight: 600, mr: 0.25 }}>Agregar:</Typography>

          <Button size="small" variant="outlined" onClick={() => addNode('decision')}
            sx={{ textTransform: 'none', fontSize: 11, py: 0.2, px: 1, minWidth: 0, borderColor: '#1976d2', color: '#1976d2', '&:hover': { borderColor: '#1565c0', bgcolor: '#e3f2fd' } }}>
            + Nodo ⬭
          </Button>
          <Button size="small" variant="outlined" onClick={() => addNode('terminal')}
            sx={{ textTransform: 'none', fontSize: 11, py: 0.2, px: 1, minWidth: 0, borderColor: '#616161', color: '#616161', '&:hover': { borderColor: '#424242', bgcolor: '#f5f5f5' } }}>
            + Hoja ○
          </Button>

          <Box sx={{ width: '1px', height: 18, bgcolor: '#e0e0e0', mx: 0.25 }} />

          <Tooltip title="Activá para arrastrar desde los puntos de conexión de los nodos y crear flechas">
            <Button size="small" variant={connectMode ? 'contained' : 'outlined'}
              startIcon={<LinkIcon sx={{ fontSize: '13px !important' }} />}
              onClick={() => setConnectMode((m) => !m)}
              sx={{ textTransform: 'none', fontSize: 11, py: 0.2, px: 1, minWidth: 0,
                ...(connectMode
                  ? { bgcolor: '#001f56', '&:hover': { bgcolor: '#00153d' } }
                  : { borderColor: '#001f56', color: '#001f56', '&:hover': { bgcolor: '#e8eaf6' } }),
              }}>
              Conectar
            </Button>
          </Tooltip>

          <Box sx={{ flex: 1 }} />

          <Button size="small" variant="text" startIcon={<DeleteForeverIcon sx={{ fontSize: '14px !important' }} />}
            onClick={deleteSelected}
            sx={{ textTransform: 'none', fontSize: 11, py: 0.2, px: 1, minWidth: 0, color: '#ef5350' }}>
            Borrar seleccionado
          </Button>
          <Button size="small" variant="text" startIcon={<ClearAllIcon sx={{ fontSize: '14px !important' }} />}
            onClick={clearAll}
            sx={{ textTransform: 'none', fontSize: 11, py: 0.2, px: 1, minWidth: 0, color: '#9e9e9e' }}>
            Limpiar todo
          </Button>
        </Box>
      )}

      {/* Canvas */}
      <Box sx={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionMode="loose"
          connectionRadius={35}
          nodesDraggable={!readOnly && !connectMode}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          deleteKeyCode={readOnly ? null : ['Delete', 'Backspace']}
          fitView
          fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
          minZoom={0.3}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant="dots" gap={16} size={1} color="#cbd5e1" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </Box>

      {/* Hint footer */}
      {!readOnly && (
        <Box sx={{ px: 1.5, py: 0.4, bgcolor: '#f9fafb', borderTop: '1px solid #f0f0f0' }}>
          <Typography sx={{ fontSize: '0.68rem', color: '#9ca3af' }}>
            Arrastrá desde los puntos de conexión para crear flechas · Doble clic en nodo o etiqueta para editar · <kbd>Supr</kbd> para borrar seleccionado
          </Typography>
        </Box>
      )}
    </Box>
  );
};

EditorInner.propTypes = {
  initialData: PropTypes.shape({ nodes: PropTypes.array, edges: PropTypes.array }),
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

// ─── Componente público ───────────────────────────────────────────────────────

const DecisionTreeEditor = ({ initialData, tree, onChange, readOnly = false }) => (
  <ReactFlowProvider>
    <EditorInner
      initialData={normalizeData(initialData, tree)}
      onChange={onChange ?? (() => {})}
      readOnly={readOnly}
    />
  </ReactFlowProvider>
);

DecisionTreeEditor.propTypes = {
  initialData: PropTypes.shape({ nodes: PropTypes.array, edges: PropTypes.array }),
  tree: PropTypes.object,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default DecisionTreeEditor;
