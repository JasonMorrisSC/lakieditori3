import React, {useEffect, useRef} from "react";
import {select, Selection} from 'd3-selection'
import {hierarchy, HierarchyPointNode, tree} from 'd3-hierarchy'
import {suomifiDesignTokens as tokens} from 'suomifi-ui-components';

type SvgContainerSelection = Selection<SVGSVGElement | null, unknown, null, undefined>;

interface Props {
  data: TreeNode,
  width?: number,
  height?: number,
}

export interface TreeNode {
  name: string,
  children?: TreeNode[],
}

const Tree: React.FC<Props> = ({data, width = 1430, height = 800}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  function clean(selection: SvgContainerSelection) {
    selection
    .selectAll("g")
    .remove();
  }

  function init(selection: SvgContainerSelection) {
    selection
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("class", "g")
    .attr("transform", "translate(" + 200 + ", " + (height / 2) + ")");

    selection
    .select('g.g')
    .append("g")
    .attr("class", "links");

    selection
    .select('g.g')
    .append("g")
    .attr("class", "nodes");
  }

  function draw(selection: SvgContainerSelection, root: HierarchyPointNode<TreeNode>, horizontal?: boolean, mirrored?: boolean) {
    let nodeEnter = selection
    .select('g.nodes')
    .selectAll('circle.node')
    .data(root.descendants())
    .enter();

    // nodes
    nodeEnter
    .append('circle')
    .classed('node', true)
    .style('fill', tokens.colors.whiteBase)
    .attr('cx', d => (mirrored ? -1 : 1) * (horizontal ? d.y : d.x))
    .attr('cy', d => (mirrored ? -1 : 1) * (horizontal ? d.x : d.y))
    .attr('r', 20);

    // node labels
    nodeEnter
    .append("text")
    .attr('x', d => (mirrored ? -1 : 1) * (horizontal ? d.y : d.x))
    .attr('y', d => (mirrored ? -1 : 1) * (horizontal ? d.x : d.y))
    .attr("dy", "0.3em")
    .attr("style", d => "font-weight:" + (d.parent === null ? 600 : 400))
    .style("text-anchor", 'middle')
    .text(d => d.data.name);

    // links
    selection
    .select('g.links')
    .selectAll('line.link')
    .data(root.links())
    .enter()
    .append('line')
    .classed('link', true)
    .style('stroke', tokens.colors.depthLight26)
    .style('stroke-width', '3px')
    .attr('x1', d => (mirrored ? -1 : 1) * (horizontal ? d.source.y : d.source.x))
    .attr('y1', d => (mirrored ? -1 : 1) * (horizontal ? d.source.x : d.source.y))
    .attr('x2', d => (mirrored ? -1 : 1) * (horizontal ? d.target.y : d.target.x))
    .attr('y2', d => (mirrored ? -1 : 1) * (horizontal ? d.target.x : d.target.y));
  }

  useEffect(() => {
    const svgElement = select(svgRef.current);

    clean(svgElement);
    init(svgElement);

    const treeLayout = tree<TreeNode>()
    .separation((a, b) => a.parent === b.parent ? 1 : 1.2)
    .nodeSize([50, 300]);

    draw(svgElement, treeLayout(hierarchy<TreeNode>(data)), true, false);
  });

  return <svg ref={svgRef}/>
};

export default Tree;
