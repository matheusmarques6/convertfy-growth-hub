import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, Info, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface SpreadsheetConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: Record<string, unknown>) => void;
}

interface DataField {
  key: string;
  value: string;
}

export function SpreadsheetConfig({ node, onUpdate }: SpreadsheetConfigProps) {
  const [authUrl, setAuthUrl] = useState<string>(node.data?.authUrl || '');
  const [authLabel, setAuthLabel] = useState<string>(node.data?.authLabel || '');
  const [sheetId, setSheetId] = useState<string>(node.data?.sheetId || '');
  const [sheetName, setSheetName] = useState<string>(node.data?.sheetName || 'Sheet1');
  const [dataFields, setDataFields] = useState<DataField[]>(
    node.data?.jsonDataFields || [{ key: '', value: '' }]
  );
  const [moveToNextNode, setMoveToNextNode] = useState(node.data?.moveToNextNode ?? true);

  useEffect(() => {
    // Build jsonData object from fields
    const jsonData: Record<string, string> = {};
    dataFields
      .filter((f) => f.key.trim() !== '')
      .forEach((f) => {
        jsonData[f.key] = f.value;
      });

    onUpdate(node.id, {
      ...node.data,
      authUrl,
      authLabel,
      sheetId,
      sheetName,
      jsonData,
      jsonDataFields: dataFields,
      moveToNextNode,
    });
  }, [authUrl, authLabel, sheetId, sheetName, dataFields, moveToNextNode]);

  const addField = () => {
    setDataFields([...dataFields, { key: '', value: '' }]);
  };

  const removeField = (index: number) => {
    setDataFields(dataFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, field: keyof DataField, value: string) => {
    const newFields = [...dataFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setDataFields(newFields);
  };

  const extractSheetId = (url: string): string => {
    // Extract sheet ID from Google Sheets URL
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : url;
  };

  return (
    <div className="space-y-4">
      {/* Info Box */}
      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3">
        <Table className="w-8 h-8 text-green-400" />
        <div>
          <p className="text-sm font-medium text-green-300">Google Sheets</p>
          <p className="text-xs text-green-400/80">Append data to a Google Spreadsheet</p>
        </div>
      </div>

      {/* Authentication */}
      <div className="space-y-3 p-3 bg-gray-800/50 rounded-lg">
        <Label className="text-gray-300">Authentication</Label>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Auth Label</Label>
          <Input
            value={authLabel}
            onChange={(e) => setAuthLabel(e.target.value)}
            placeholder="My Google Account"
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Service Account JSON URL</Label>
          <Input
            value={authUrl}
            onChange={(e) => setAuthUrl(e.target.value)}
            placeholder="https://your-server.com/service-account.json"
            className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            URL to your Google Service Account credentials JSON file
          </p>
        </div>
      </div>

      {/* Sheet Configuration */}
      <div className="space-y-3">
        <Label className="text-gray-300">Spreadsheet</Label>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Spreadsheet ID or URL</Label>
          <Input
            value={sheetId}
            onChange={(e) => setSheetId(extractSheetId(e.target.value))}
            placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
            className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
          />
          <p className="text-xs text-gray-500">
            Paste the full Google Sheets URL or just the ID
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-400">Sheet Name (Tab)</Label>
          <Input
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
            placeholder="Sheet1"
            className="bg-gray-800 border-gray-700 text-white"
          />
          <p className="text-xs text-gray-500">
            Name of the tab within the spreadsheet
          </p>
        </div>
      </div>

      {/* Data Fields */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300">Data to Save</Label>
          <Button size="sm" variant="outline" onClick={addField}>
            <Plus className="w-3 h-3 mr-1" /> Add Column
          </Button>
        </div>

        {dataFields.map((field, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input
              value={field.key}
              onChange={(e) => updateField(idx, 'key', e.target.value)}
              placeholder="Column name"
              className="bg-gray-800 border-gray-700 text-white flex-1"
            />
            <Input
              value={field.value}
              onChange={(e) => updateField(idx, 'value', e.target.value)}
              placeholder="{{{variableName}}}"
              className="bg-gray-800 border-gray-700 text-white flex-1 font-mono text-sm"
            />
            <Button size="icon" variant="ghost" onClick={() => removeField(idx)}>
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        ))}
      </div>

      {/* Setup Info */}
      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-2">
        <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-blue-300">
          <p className="font-medium mb-1">Setup Requirements:</p>
          <ol className="text-blue-400/80 ml-4 list-decimal space-y-0.5">
            <li>Create a Google Cloud Project</li>
            <li>Enable Google Sheets API</li>
            <li>Create a Service Account</li>
            <li>Share the spreadsheet with the service account email</li>
            <li>Host the JSON credentials file at a URL</li>
          </ol>
        </div>
      </div>

      {/* Google Sheets Link */}
      {sheetId && (
        <a
          href={`https://docs.google.com/spreadsheets/d/${sheetId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300"
        >
          <ExternalLink className="w-4 h-4" />
          Open Spreadsheet
        </a>
      )}

      {/* Move to Next Node */}
      <div className="pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-gray-300">Continue to Next Node</Label>
            <p className="text-xs text-gray-500">Proceed after saving data</p>
          </div>
          <Switch checked={moveToNextNode} onCheckedChange={setMoveToNextNode} />
        </div>
      </div>
    </div>
  );
}
