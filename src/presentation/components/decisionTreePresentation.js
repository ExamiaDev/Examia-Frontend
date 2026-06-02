import { isLeafNode } from './decisionTreeUtils';

export const TREE_NODE_LAYOUT_WIDTH = { question: 132, result: 220 };

export const getTreeNodePresentation = (tree, nodeId, node, displayNumbers) => {
  const isRoot = nodeId === tree.rootId;
  const isLeaf = isLeafNode(node);
  const isQuestionNode = !isLeaf;

  return {
    isRoot,
    isLeaf,
    isQuestionNode,
    displayNum: displayNumbers[nodeId] ?? '?',
    nodeKind: isRoot ? 'Inicio' : isLeaf ? 'Resultado' : 'Pregunta',
    nodeColor: isRoot ? '#001f56' : isLeaf ? '#2e7d32' : '#3949ab',
  };
};
