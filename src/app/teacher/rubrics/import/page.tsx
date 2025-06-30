'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileJson, Upload } from 'lucide-react';
import { useState } from 'react';

export default function ImportExportRubricPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dummy data untuk contoh export
  const exampleRubric = {
    name: 'Rubrik Standar HOTS',
    description: 'Rubrik umum untuk penilaian aktivitas HOTS',
    maxScore: 100,
    isDefault: true,
    criteria: [
      {
        name: 'HOTS Integration & Variety',
        description:
          'Sejauh mana siswa menerapkan berbagai keterampilan berpikir tingkat tinggi',
        weight: 40,
        levels: [
          {
            value: '4',
            description: 'Integrasi HOTS sangat baik',
            score: 40,
          },
          {
            value: '3',
            description: 'Integrasi HOTS baik',
            score: 30,
          },
          {
            value: '2',
            description: 'Integrasi HOTS cukup',
            score: 20,
          },
          {
            value: '1',
            description: 'Integrasi HOTS kurang',
            score: 10,
          },
        ],
      },
      {
        name: 'Clarity & Scaffolding',
        description: 'Kejelasan dan struktur dalam menyampaikan pemikiran',
        weight: 35,
        levels: [
          {
            value: '4',
            description: 'Sangat jelas dan terstruktur',
            score: 35,
          },
          {
            value: '3',
            description: 'Jelas dan terstruktur',
            score: 26,
          },
          { value: '2', description: 'Cukup jelas', score: 17 },
          { value: '1', description: 'Kurang jelas', score: 8 },
        ],
      },
      {
        name: 'Content Quality',
        description: 'Kualitas konten dan kedalaman pemikiran',
        weight: 25,
        levels: [
          {
            value: '4',
            description: 'Kualitas sangat baik',
            score: 25,
          },
          { value: '3', description: 'Kualitas baik', score: 19 },
          { value: '2', description: 'Kualitas cukup', score: 13 },
          { value: '1', description: 'Kualitas kurang', score: 6 },
        ],
      },
    ],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImportJSON = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      console.log('Imported JSON:', parsedJson);
      alert('Rubrik berhasil diimpor!');
    } catch (error) {
      console.error('Error parsing JSON:', error);
      alert('Format JSON tidak valid!');
    }
  };

  const handleImportFile = () => {
    if (!selectedFile) {
      alert('Pilih file terlebih dahulu!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedJson = JSON.parse(content);
        console.log('Imported JSON from file:', parsedJson);
        alert('Rubrik berhasil diimpor dari file!');
      } catch (error) {
        console.error('Error parsing JSON from file:', error);
        alert('Format file tidak valid!');
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(exampleRubric, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'rubrik_standar_hots.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Import & Export Rubrik</h1>
      </div>

      <Tabs defaultValue="import">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Rubrik</TabsTrigger>
          <TabsTrigger value="export">Export Rubrik</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import dari JSON</CardTitle>
              <CardDescription>
                Tempel kode JSON rubrik untuk mengimpornya
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder='{"name": "Nama Rubrik", "description": "Deskripsi", ...}'
                rows={10}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="font-mono text-sm"
              />
              <Button
                onClick={handleImportJSON}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import JSON</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Import dari File</CardTitle>
              <CardDescription>Unggah file JSON rubrik</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="rubric-file">File Rubrik</Label>
                <Input
                  id="rubric-file"
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                />
              </div>
              <Button
                onClick={handleImportFile}
                className="flex items-center gap-2"
                disabled={!selectedFile}
              >
                <FileJson className="h-4 w-4" />
                <span>Import dari File</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Rubrik</CardTitle>
              <CardDescription>
                Pilih rubrik yang ingin diekspor
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="export-rubric">Pilih Rubrik</Label>
                <select
                  id="export-rubric"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="1">Rubrik Standar HOTS</option>
                  <option value="2">Rubrik Menulis Esai</option>
                  <option value="3">Rubrik Presentasi Lisan</option>
                  <option value="4">Rubrik Analisis Teks</option>
                </select>
              </div>
              <Button
                onClick={handleExportJSON}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Export ke JSON</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview JSON</CardTitle>
              <CardDescription>
                Pratinjau format JSON dari rubrik yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-auto rounded-md bg-slate-100 p-4 text-xs">
                {JSON.stringify(exampleRubric, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
