import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface SendMessageConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

type MessageType = 'text' | 'image' | 'video' | 'document' | 'audio' | 'button' | 'list';

interface ButtonItem {
  id: string;
  title: string;
}

interface ListSection {
  title: string;
  rows: Array<{ id: string; title: string; description?: string }>;
}

export function SendMessageConfig({ node, onUpdate }: SendMessageConfigProps) {
  const [messageType, setMessageType] = useState<MessageType>(
    node.data?.content?.type || node.data?.type?.type || 'text'
  );
  const [textBody, setTextBody] = useState(node.data?.content?.text?.body || '');
  const [previewUrl, setPreviewUrl] = useState(node.data?.content?.text?.preview_url || false);
  const [mediaLink, setMediaLink] = useState(
    node.data?.content?.image?.link ||
    node.data?.content?.video?.link ||
    node.data?.content?.document?.link ||
    node.data?.content?.audio?.link ||
    ''
  );
  const [mediaCaption, setMediaCaption] = useState(
    node.data?.content?.image?.caption ||
    node.data?.content?.video?.caption ||
    node.data?.content?.document?.caption ||
    ''
  );
  const [buttons, setButtons] = useState<ButtonItem[]>(
    node.data?.content?.interactive?.action?.buttons?.map((b: { reply: ButtonItem }) => b.reply) ||
    [{ id: '1', title: 'Button 1' }]
  );
  const [listSections, setListSections] = useState<ListSection[]>(
    node.data?.content?.interactive?.action?.sections ||
    [{ title: 'Section 1', rows: [{ id: '1', title: 'Item 1' }] }]
  );
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? true);

  useEffect(() => {
    const content = buildContent();
    onUpdate(node.id, {
      ...node.data,
      content,
      type: { type: messageType, title: messageType },
      moveToNextNode,
    });
  }, [messageType, textBody, previewUrl, mediaLink, mediaCaption, buttons, listSections, moveToNextNode]);

  const buildContent = () => {
    switch (messageType) {
      case 'text':
        return {
          type: 'text',
          text: { body: textBody, preview_url: previewUrl },
        };
      case 'image':
        return {
          type: 'image',
          image: { link: mediaLink, caption: mediaCaption },
        };
      case 'video':
        return {
          type: 'video',
          video: { link: mediaLink, caption: mediaCaption },
        };
      case 'document':
        return {
          type: 'document',
          document: { link: mediaLink, caption: mediaCaption },
        };
      case 'audio':
        return {
          type: 'audio',
          audio: { link: mediaLink },
        };
      case 'button':
        return {
          type: 'interactive',
          interactive: {
            type: 'button',
            body: { text: textBody },
            action: {
              buttons: buttons.map((b) => ({
                type: 'reply',
                reply: { id: b.id, title: b.title },
              })),
            },
          },
        };
      case 'list':
        return {
          type: 'interactive',
          interactive: {
            type: 'list',
            body: { text: textBody },
            action: {
              button: 'Menu',
              sections: listSections,
            },
          },
        };
      default:
        return { type: 'text', text: { body: textBody } };
    }
  };

  const addButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, { id: String(buttons.length + 1), title: `Button ${buttons.length + 1}` }]);
    }
  };

  const removeButton = (index: number) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index: number, field: keyof ButtonItem, value: string) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setButtons(newButtons);
  };

  const addListSection = () => {
    setListSections([...listSections, { title: `Section ${listSections.length + 1}`, rows: [] }]);
  };

  const addListRow = (sectionIndex: number) => {
    const newSections = [...listSections];
    newSections[sectionIndex].rows.push({
      id: String(Date.now()),
      title: `Item ${newSections[sectionIndex].rows.length + 1}`,
    });
    setListSections(newSections);
  };

  return (
    <div className="space-y-4">
      {/* Message Type */}
      <div className="space-y-2">
        <Label className="text-gray-300">Message Type</Label>
        <Select value={messageType} onValueChange={(v) => setMessageType(v as MessageType)}>
          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="document">Document</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
            <SelectItem value="button">Buttons</SelectItem>
            <SelectItem value="list">List Menu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Text Content */}
      {(messageType === 'text' || messageType === 'button' || messageType === 'list') && (
        <div className="space-y-2">
          <Label className="text-gray-300">Message Text</Label>
          <Textarea
            value={textBody}
            onChange={(e) => setTextBody(e.target.value)}
            placeholder="Enter your message... Use {{{variableName}}} for variables"
            className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
          />
          <p className="text-xs text-gray-500">
            Tip: Use {'{{{name}}}'} to insert variables
          </p>
        </div>
      )}

      {/* Preview URL for Text */}
      {messageType === 'text' && (
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Preview URL Links</Label>
          <Switch checked={previewUrl} onCheckedChange={setPreviewUrl} />
        </div>
      )}

      {/* Media Link */}
      {(messageType === 'image' || messageType === 'video' || messageType === 'document' || messageType === 'audio') && (
        <div className="space-y-2">
          <Label className="text-gray-300">Media URL</Label>
          <Input
            value={mediaLink}
            onChange={(e) => setMediaLink(e.target.value)}
            placeholder="https://example.com/media.jpg"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      )}

      {/* Media Caption */}
      {(messageType === 'image' || messageType === 'video' || messageType === 'document') && (
        <div className="space-y-2">
          <Label className="text-gray-300">Caption (optional)</Label>
          <Input
            value={mediaCaption}
            onChange={(e) => setMediaCaption(e.target.value)}
            placeholder="Enter caption..."
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>
      )}

      {/* Buttons */}
      {messageType === 'button' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Buttons (max 3)</Label>
            {buttons.length < 3 && (
              <Button size="sm" variant="outline" onClick={addButton}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            )}
          </div>
          {buttons.map((btn, idx) => (
            <div key={idx} className="flex gap-2">
              <Input
                value={btn.id}
                onChange={(e) => updateButton(idx, 'id', e.target.value)}
                placeholder="ID"
                className="bg-gray-800 border-gray-700 text-white w-20"
              />
              <Input
                value={btn.title}
                onChange={(e) => updateButton(idx, 'title', e.target.value)}
                placeholder="Button text"
                className="bg-gray-800 border-gray-700 text-white flex-1"
              />
              <Button size="icon" variant="ghost" onClick={() => removeButton(idx)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* List Menu */}
      {messageType === 'list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Sections</Label>
            <Button size="sm" variant="outline" onClick={addListSection}>
              <Plus className="w-3 h-3 mr-1" /> Add Section
            </Button>
          </div>
          {listSections.map((section, sIdx) => (
            <div key={sIdx} className="p-3 bg-gray-800/50 rounded-lg space-y-2">
              <Input
                value={section.title}
                onChange={(e) => {
                  const newSections = [...listSections];
                  newSections[sIdx].title = e.target.value;
                  setListSections(newSections);
                }}
                placeholder="Section title"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <div className="pl-3 space-y-1">
                {section.rows.map((row, rIdx) => (
                  <Input
                    key={rIdx}
                    value={row.title}
                    onChange={(e) => {
                      const newSections = [...listSections];
                      newSections[sIdx].rows[rIdx].title = e.target.value;
                      setListSections(newSections);
                    }}
                    placeholder="Item title"
                    className="bg-gray-700 border-gray-600 text-white text-sm"
                  />
                ))}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addListRow(sIdx)}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Item
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Automatically proceed after sending</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
