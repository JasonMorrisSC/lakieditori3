interface NavigationTreeNode {
  to: string,
  label: string,
  children?: NavigationTreeNode[],
}

export default NavigationTreeNode;
