export const createDefaultDecisionTree = () => ({
  rootId: 'n1',
  nodes: {
    n1: {
      text: '',
      branches: [
        { label: 'Sí', nextId: 'n2' },
        { label: 'No', nextId: 'n3' },
      ],
    },
    n2: {
      text: 'Resultado si la respuesta es Sí',
      branches: [],
    },
    n3: {
      text: 'Resultado si la respuesta es No',
      branches: [],
    },
  },
});

export const getDecisionTree = (question) => {
  if (question?.decisionTree?.rootId && question.decisionTree?.nodes) {
    return question.decisionTree;
  }
  return null;
};

export const getNode = (tree, nodeId) => tree?.nodes?.[nodeId] ?? null;

export const isLeafNode = (node) => !node?.branches?.length;

export const nextNodeId = (nodes = {}) => {
  const nums = Object.keys(nodes)
    .map((id) => /^n(\d+)$/.exec(id))
    .filter(Boolean)
    .map((match) => Number(match[1]));
  const max = nums.length ? Math.max(...nums) : 0;
  return `n${max + 1}`;
};

export const getNodeDisplayNumbers = (tree) => {
  const numbers = {};
  if (!tree?.rootId) return numbers;

  let counter = 1;
  const walk = (nodeId) => {
    numbers[nodeId] = counter;
    counter += 1;
    const node = getNode(tree, nodeId);
    (node?.branches ?? []).forEach((branch) => walk(branch.nextId));
  };
  walk(tree.rootId);
  return numbers;
};

export const collectSubtreeIds = (tree, nodeId) => {
  const ids = new Set();
  const walk = (id) => {
    ids.add(id);
    const node = getNode(tree, id);
    (node?.branches ?? []).forEach((branch) => walk(branch.nextId));
  };
  walk(nodeId);
  return ids;
};

export const updateNodeText = (tree, nodeId, text) => ({
  ...tree,
  nodes: {
    ...tree.nodes,
    [nodeId]: { ...tree.nodes[nodeId], text },
  },
});

export const updateBranchLabel = (tree, nodeId, branchIndex, label) => {
  const node = getNode(tree, nodeId);
  const branches = [...(node?.branches ?? [])];
  branches[branchIndex] = { ...branches[branchIndex], label };
  return {
    ...tree,
    nodes: {
      ...tree.nodes,
      [nodeId]: { ...node, branches },
    },
  };
};

export const addBranchToNode = (tree, nodeId) => {
  const node = getNode(tree, nodeId);
  if (!node) return tree;

  const nodes = { ...tree.nodes };
  const newId = nextNodeId(nodes);
  nodes[newId] = { text: '', branches: [] };
  const branchCount = (node.branches ?? []).length;
  nodes[nodeId] = {
    ...node,
    branches: [
      ...(node.branches ?? []),
      { label: `Opción ${branchCount + 1}`, nextId: newId },
    ],
  };
  return { ...tree, nodes };
};

export const removeBranchFromNode = (tree, nodeId, branchIndex) => {
  const node = getNode(tree, nodeId);
  if (!node?.branches?.length) return tree;

  const isRoot = nodeId === tree.rootId;
  const minBranches = isRoot ? 2 : 1;
  if (node.branches.length <= minBranches) return tree;

  const branch = node.branches[branchIndex];
  const subtreeIds = collectSubtreeIds(tree, branch.nextId);
  const nodes = { ...tree.nodes };

  nodes[nodeId] = {
    ...node,
    branches: node.branches.filter((_, idx) => idx !== branchIndex),
  };
  subtreeIds.forEach((id) => delete nodes[id]);

  return { ...tree, nodes };
};

export const extendLeafNode = (tree, leafId) => {
  const node = getNode(tree, leafId);
  if (!node || !isLeafNode(node)) return tree;

  const nodes = { ...tree.nodes };
  const id1 = nextNodeId(nodes);
  nodes[id1] = { text: '', branches: [] };
  const id2 = nextNodeId({ ...nodes, [id1]: nodes[id1] });
  nodes[id2] = { text: '', branches: [] };
  nodes[leafId] = {
    ...node,
    branches: [
      { label: 'Opción 1', nextId: id1 },
      { label: 'Opción 2', nextId: id2 },
    ],
  };
  return { ...tree, nodes };
};

export const sanitizeCorrectPath = (tree, correctPath = []) => {
  if (!correctPath.length) return correctPath;

  let currentId = tree.rootId;
  const valid = [];

  for (const label of correctPath) {
    const node = getNode(tree, currentId);
    const branch = node?.branches?.find((b) => b.label === label);
    if (!branch) break;
    valid.push(label);
    currentId = branch.nextId;
  }

  const endNode = getNode(tree, currentId);
  if (!endNode || !isLeafNode(endNode) || valid.length === 0) {
    const paths = getAllTreePaths(tree);
    return paths[0] ?? [];
  }

  return valid;
};

export const getCurrentNodeId = (tree, path = []) => {
  if (!tree?.rootId) return null;
  let currentId = tree.rootId;
  for (const label of path) {
    const node = getNode(tree, currentId);
    const branch = node?.branches?.find((b) => b.label === label);
    if (!branch?.nextId) return currentId;
    currentId = branch.nextId;
  }
  return currentId;
};

export const isDecisionTreeComplete = (tree, path = []) => {
  const nodeId = getCurrentNodeId(tree, path);
  const node = getNode(tree, nodeId);
  return !!node && isLeafNode(node) && path.length > 0;
};

export const getAllTreePaths = (tree) => {
  if (!tree?.rootId) return [];

  const paths = [];
  const walk = (nodeId, currentPath) => {
    const node = getNode(tree, nodeId);
    if (!node) return;

    if (isLeafNode(node)) {
      if (currentPath.length > 0) paths.push([...currentPath]);
      return;
    }

    node.branches.forEach((branch) => {
      walk(branch.nextId, [...currentPath, branch.label]);
    });
  };

  walk(tree.rootId, []);
  return paths;
};

export const formatDecisionPath = (path = []) => (path.length ? path.join(' → ') : 'Sin recorrido');

export const pathsAreEqual = (a = [], b = []) =>
  a.length === b.length && a.every((value, index) => value === b[index]);
