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
import { Plus, Trash2, MessageCircle } from 'lucide-react';
import { CredentialSelector } from '@/components/flow/CredentialSelector';

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
  const data = node.data as Record<string, unknown> | undefined;
  const content = data?.content as Record<string, unknown> | undefined;
  const typeData = data?.type as Record<string, unknown> | undefined;

  const [messageType, setMessageType] = useState<MessageType>(
    (content?.type as MessageType) || (typeData?.type as MessageType) || 'text'
  );
  const [textBody, setTextBody] = useState<string>((content?.text as Record<string, unknown>)?.body as string || '');
  const [previewUrl, setPreviewUrl] = useState<boolean>((content?.text as Record<string, unknown>)?.preview_url as boolean || false);
  const [mediaLink, setMediaLink] = useState<string>(
    (content?.image as Record<string, unknown>)?.link as string ||
    (content?.video as Record<string, unknown>)?.link as string ||
    (content?.document as Record<string, unknown>)?.link as string ||
    (content?.audio as Record<string, unknown>)?.link as string ||
    ''
  );
  const [mediaCaption, setMediaCaption] = useState<string>(
    (content?.image as Record<string, unknown>)?.caption as string ||
    (content?.video as Record<string, unknown>)?.caption as string ||
    (content?.document as Record<string, unknown>)?.caption as string ||
    ''
  );
  const interactive = content?.interactive as Record<string, unknown> | undefined;
  const action = interactive?.action as Record<string, unknown> | undefined;
  const [buttons, setButtons] = useState<ButtonItem[]>(
    (action?.buttons as Array<{ reply: ButtonItem }>)?.map((b) => b.reply) ||
    [{ id: '1', title: 'Button 1' }]
  );
  const [listSections, setListSections] = useState<ListSection[]>(
    (action?.sections as ListSection[]) ||
    [{ title: 'Section 1', rows: [{ id: '1', title: 'Item 1' }] }]
  );
  const [moveToNextNode, setMoveToNextNode] = useState<boolean>((data?.moveToNextNode as boolean) ?? true);
  const [credentialId, setCredentialId] = useState<string | null>((data?.credentialId as string) || null);

  useEffect(() => {
    const builtContent = buildContent();
    onUpdate(node.id, {
      ...node.data,
      content: builtContent,
      type: { type: messageType, title: messageType },
      moveToNextNode,
      credentialId,
    });
  }, [messageType, textBody, previewUrl, mediaLink, mediaCaption, buttons, listSections, moveToNextNode, credentialId]);

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
      {/* WhatsApp Credential */}
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
        <MessageCircle className="w-8 h-8 text-green-400" />
        <div>
          <p className="text-sm font-medium text-green-300">Enviar Mensagem WhatsApp</p>
          <p className="text-xs text-green-400/80">Envie mensagens via WhatsApp Business API</p>
        </div>
      </div>

      <CredentialSelector
        label="Conta WhatsApp"
        credentialType="whatsapp_api"
        selectedId={credentialId}
        onChange={setCredentialId}
        description="Selecione a conta do WhatsApp Business para enviar mensagens"
      />

      {/* Message Type */}
      <div className="space-y-2">
        <Label className="text-gray-300">Tipo de Mensagem</Label>
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
