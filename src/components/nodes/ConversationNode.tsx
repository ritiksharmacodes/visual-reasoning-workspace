import { NodeResizer, OnResizeEnd, type NodeProps, Node, Handle, Position } from "@xyflow/react";
import toast, { Toaster } from 'react-hot-toast';
import { update_node_dimensions } from "@/actions";

type ConversationNode = Node<
  {
    title: string;
  },
  'title'
>;

export default function ConversationNode({
  id,
  data,
  selected
}: NodeProps<ConversationNode>) {

  const notify = () => toast('Unable to update node');

  const handleNodeResizeStop: OnResizeEnd = async (event, node) => {
    const temp = {
      id: id,
      width: node.width ?? 200,
      height: node.height ?? 200,
      x: node.x,
      y: node.y,
    };

    const updatedNode = await update_node_dimensions(temp);

    if ("error" in updatedNode) {
      notify();
    }
  };

  return (
    <>
      <Toaster />
      <NodeResizer
        isVisible={selected}
        minWidth={250}
        minHeight={200}
        handleClassName="!rounded-full !w-4 !h-4 !bg-blue-500 !border-2 !border-white hover:!scale-125 transition-transform"
        onResizeEnd={handleNodeResizeStop}
      />

      <div className="w-full h-full min-w-[250px] min-h-[200px] flex flex-col rounded-lg border bg-white shadow">
        <div className="border-b p-3 font-semibold">
          {data.title}
        </div>

        {/* Conversation Area - flex-1 forces this box to stretch and fill all empty space */}
        <div className="flex-1 p-3 text-sm text-gray-500 overflow-y-auto">
          Conversation Area
        </div>

        {/* Input Footer */}
        <div className="border-t p-3">
          <input
            className="w-full rounded border p-2"
            placeholder="Continue chat..."
          />
        </div>
      </div>

      {/* following code is for handles */}
      <Handle
        type="source"
        position={Position.Right}                
        className="!w-4 !h-4"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!w-4 !h-4"
      />
    </>
  );
}