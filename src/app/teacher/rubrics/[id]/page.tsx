"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    ClipboardList,
    Download,
    Edit,
    MoreHorizontal,
    Plus,
    Trash2,
} from "lucide-react";
import Link from "next/link";

const rubricData = {
    id: "1",
    name: "Rubrik Standar HOTS",
    description: "Rubrik umum untuk penilaian aktivitas HOTS",
    maxScore: 100,
    isDefault: true,
    createdBy: "Ms. Johnson",
    createdAt: "2024-06-10",
    updatedAt: "2024-06-15",
    criteria: [
        {
            id: "1",
            name: "HOTS Integration & Variety",
            description:
                "Sejauh mana siswa menerapkan berbagai keterampilan berpikir tingkat tinggi",
            weight: 40,
            levels: [
                {
                    value: "4",
                    description: "Integrasi HOTS sangat baik",
                    score: 40,
                },
                { value: "3", description: "Integrasi HOTS baik", score: 30 },
                { value: "2", description: "Integrasi HOTS cukup", score: 20 },
                { value: "1", description: "Integrasi HOTS kurang", score: 10 },
            ],
        },
        {
            id: "2",
            name: "Clarity & Scaffolding",
            description: "Kejelasan dan struktur dalam menyampaikan pemikiran",
            weight: 35,
            levels: [
                {
                    value: "4",
                    description: "Sangat jelas dan terstruktur",
                    score: 35,
                },
                { value: "3", description: "Jelas dan terstruktur", score: 26 },
                { value: "2", description: "Cukup jelas", score: 17 },
                { value: "1", description: "Kurang jelas", score: 8 },
            ],
        },
        {
            id: "3",
            name: "Content Quality",
            description: "Kualitas konten dan kedalaman pemikiran",
            weight: 25,
            levels: [
                { value: "4", description: "Kualitas sangat baik", score: 25 },
                { value: "3", description: "Kualitas baik", score: 19 },
                { value: "2", description: "Kualitas cukup", score: 13 },
                { value: "1", description: "Kualitas kurang", score: 6 },
            ],
        },
    ],
    usedIn: [
        { id: "1", title: "Analisis Artikel Berita", type: "assignment" },
        { id: "2", title: "Menulis Esai Argumentatif", type: "assignment" },
        { id: "3", title: "Modul Berpikir Kritis", type: "module" },
    ],
};

// Interface untuk kriteria level yang akan diedit
interface EditableCriterionLevel {
    value: string;
    description: string;
    score: number;
}

// Interface untuk kriteria yang akan diedit
interface EditableCriterion {
    id: string;
    name: string;
    description: string;
    weight: number;
    levels: EditableCriterionLevel[];
}

export default function RubricDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const [rubric, setRubric] = useState(rubricData);
    const [editMode, setEditMode] = useState(false);
    const [editedRubric, setEditedRubric] = useState({
        name: rubric.name,
        description: rubric.description,
        maxScore: rubric.maxScore,
        isDefault: rubric.isDefault,
    });

    const [editCriterionDialogOpen, setEditCriterionDialogOpen] =
        useState(false);
    const [currentEditingCriterion, setCurrentEditingCriterion] =
        useState<EditableCriterion | null>(null);
    const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] =
        useState(false);

    useEffect(() => {
        // In a real app, fetch the rubric data based on params.id
        console.log("Fetching rubric with ID:", params.id);
        // Dummy implementation - in real app, this would be an API call
        // fetchRubric(params.id).then(setRubric);
    }, [params.id]);

    const handleEditRubric = () => {
        setEditMode(true);
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditedRubric({
            name: rubric.name,
            description: rubric.description,
            maxScore: rubric.maxScore,
            isDefault: rubric.isDefault,
        });
    };

    const handleSaveRubric = () => {
        // In a real app, call API to update the rubric
        console.log("Saving rubric:", editedRubric);

        setRubric({
            ...rubric,
            ...editedRubric,
            updatedAt: new Date().toISOString(),
        });

        setEditMode(false);
        alert("Rubrik berhasil diperbarui!");
    };

    const handleEditCriterion = (criterion: EditableCriterion) => {
        setCurrentEditingCriterion(JSON.parse(JSON.stringify(criterion)));
        setEditCriterionDialogOpen(true);
    };

    const handleSaveCriterion = () => {
        if (!currentEditingCriterion) return;

        // In a real app, call API to update the criterion
        console.log("Saving criterion:", currentEditingCriterion);

        setRubric({
            ...rubric,
            criteria: rubric.criteria.map((c) =>
                c.id === currentEditingCriterion.id
                    ? currentEditingCriterion
                    : c
            ),
            updatedAt: new Date().toISOString(),
        });

        setEditCriterionDialogOpen(false);
        setCurrentEditingCriterion(null);
        alert("Kriteria berhasil diperbarui!");
    };

    const handleAddNewCriterion = () => {
        const newCriterion: EditableCriterion = {
            id: `new-${Date.now()}`,
            name: "Kriteria Baru",
            description: "Deskripsi kriteria baru",
            weight: 20,
            levels: [
                { value: "4", description: "Level 4", score: 20 },
                { value: "3", description: "Level 3", score: 15 },
                { value: "2", description: "Level 2", score: 10 },
                { value: "1", description: "Level 1", score: 5 },
            ],
        };

        setCurrentEditingCriterion(newCriterion);
        setEditCriterionDialogOpen(true);
    };

    const handleDeleteCriterion = (criterionId: string) => {
        if (rubric.criteria.length <= 1) {
            alert("Rubrik harus memiliki minimal satu kriteria!");
            return;
        }

        // In a real app, call API to delete the criterion
        console.log("Deleting criterion:", criterionId);

        setRubric({
            ...rubric,
            criteria: rubric.criteria.filter((c) => c.id !== criterionId),
            updatedAt: new Date().toISOString(),
        });

        alert("Kriteria berhasil dihapus!");
    };

    const handleExportRubric = () => {
        const jsonString = JSON.stringify(rubric, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `rubrik-${rubric.name
            .toLowerCase()
            .replace(/\s+/g, "-")}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDeleteRubric = () => {
        setDeleteConfirmDialogOpen(true);
    };

    const confirmDeleteRubric = () => {
        // In a real app, call API to delete the rubric
        console.log("Deleting rubric:", rubric.id);

        setDeleteConfirmDialogOpen(false);
        // In a real app, this would redirect to the rubrics list page
        alert("Rubrik berhasil dihapus!");
    };

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <Link href='/teacher/rubrics'>
                        <Button variant='outline' size='icon'>
                            <ArrowLeft className='h-4 w-4' />
                        </Button>
                    </Link>
                    <h1 className='text-3xl font-bold'>Detail Rubrik</h1>
                    {rubric.isDefault && <Badge>Default</Badge>}
                </div>

                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        onClick={handleExportRubric}
                        className='flex items-center gap-2'
                    >
                        <Download className='h-4 w-4' />
                        <span>Export JSON</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline'>
                                <MoreHorizontal className='h-4 w-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            {!editMode && (
                                <DropdownMenuItem onClick={handleEditRubric}>
                                    <Edit className='h-4 w-4 mr-2' />
                                    Edit Rubrik
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleAddNewCriterion}>
                                <Plus className='h-4 w-4 mr-2' />
                                Tambah Kriteria
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={handleDeleteRubric}
                                className='text-destructive'
                            >
                                <Trash2 className='h-4 w-4 mr-2' />
                                Hapus Rubrik
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {editMode ? (
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                onClick={handleCancelEdit}
                            >
                                Batal
                            </Button>
                            <Button onClick={handleSaveRubric}>
                                Simpan Perubahan
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className='flex justify-between'>
                        <div>
                            {editMode ? (
                                <Input
                                    value={editedRubric.name}
                                    onChange={(e) =>
                                        setEditedRubric({
                                            ...editedRubric,
                                            name: e.target.value,
                                        })
                                    }
                                    className='text-xl font-bold'
                                />
                            ) : (
                                <CardTitle>{rubric.name}</CardTitle>
                            )}
                            <CardDescription>
                                Dibuat oleh {rubric.createdBy} pada{" "}
                                {rubric.createdAt}
                                {rubric.updatedAt !== rubric.createdAt && (
                                    <span>
                                        {" "}
                                        • Diperbarui pada {rubric.updatedAt}
                                    </span>
                                )}
                            </CardDescription>
                        </div>
                        <div className='text-right'>
                            <div className='text-sm text-muted-foreground'>
                                Skor Maksimum
                            </div>
                            {editMode ? (
                                <Input
                                    type='number'
                                    min={1}
                                    max={1000}
                                    value={editedRubric.maxScore}
                                    onChange={(e) =>
                                        setEditedRubric({
                                            ...editedRubric,
                                            maxScore: Number(e.target.value),
                                        })
                                    }
                                    className='w-24 text-right'
                                />
                            ) : (
                                <div className='text-xl font-bold'>
                                    {rubric.maxScore}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {editMode ? (
                        <Textarea
                            value={editedRubric.description}
                            onChange={(e) =>
                                setEditedRubric({
                                    ...editedRubric,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                            placeholder='Masukkan deskripsi rubrik'
                        />
                    ) : (
                        <p>{rubric.description}</p>
                    )}
                </CardContent>
            </Card>

            <Tabs defaultValue='criteria'>
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value='criteria'>
                        Kriteria Penilaian
                    </TabsTrigger>
                    <TabsTrigger value='usage'>Penggunaan Rubrik</TabsTrigger>
                </TabsList>

                <TabsContent value='criteria' className='mt-4 space-y-4'>
                    {rubric.criteria.map((criterion) => (
                        <Card key={criterion.id}>
                            <CardHeader className='pb-2'>
                                <div className='flex justify-between'>
                                    <div>
                                        <CardTitle className='flex items-center gap-2'>
                                            <ClipboardList className='h-5 w-5 text-muted-foreground' />
                                            {criterion.name}
                                        </CardTitle>
                                        <CardDescription>
                                            {criterion.description}
                                        </CardDescription>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <Badge variant='outline'>
                                            Bobot: {criterion.weight}%
                                        </Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant='ghost'
                                                    size='sm'
                                                >
                                                    <MoreHorizontal className='h-4 w-4' />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleEditCriterion(
                                                            criterion
                                                        )
                                                    }
                                                >
                                                    <Edit className='h-4 w-4 mr-2' />
                                                    Edit Kriteria
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDeleteCriterion(
                                                            criterion.id
                                                        )
                                                    }
                                                    className='text-destructive'
                                                >
                                                    <Trash2 className='h-4 w-4 mr-2' />
                                                    Hapus Kriteria
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className='grid grid-cols-4 gap-2'>
                                    {criterion.levels.map((level) => (
                                        <div
                                            key={level.value}
                                            className='border rounded-md p-3'
                                        >
                                            <div className='flex items-center justify-between mb-1'>
                                                <div className='font-medium'>
                                                    Level {level.value}
                                                </div>
                                                <Badge variant='secondary'>
                                                    {level.score} poin
                                                </Badge>
                                            </div>
                                            <p className='text-sm text-muted-foreground'>
                                                {level.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className='text-center'>
                        <Button
                            variant='outline'
                            onClick={handleAddNewCriterion}
                            className='flex items-center gap-2'
                        >
                            <Plus className='h-4 w-4' />
                            <span>Tambah Kriteria Baru</span>
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value='usage' className='mt-4'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Penggunaan Rubrik</CardTitle>
                            <CardDescription>
                                Rubrik ini digunakan pada tugas dan modul
                                berikut
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {rubric.usedIn.length === 0 ? (
                                <p className='text-center text-muted-foreground py-8'>
                                    Rubrik ini belum digunakan pada tugas atau
                                    modul manapun.
                                </p>
                            ) : (
                                <div className='space-y-3'>
                                    {rubric.usedIn.map((item) => (
                                        <div
                                            key={item.id}
                                            className='flex items-center justify-between border-b pb-2'
                                        >
                                            <div className='flex items-center gap-2'>
                                                {item.type === "assignment" ? (
                                                    <Badge variant='secondary'>
                                                        Tugas
                                                    </Badge>
                                                ) : (
                                                    <Badge>Modul</Badge>
                                                )}
                                                <span>{item.title}</span>
                                            </div>
                                            <Button variant='ghost' size='sm'>
                                                Lihat
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialog untuk edit/tambah kriteria */}
            <Dialog
                open={editCriterionDialogOpen}
                onOpenChange={setEditCriterionDialogOpen}
            >
                <DialogContent className='max-w-2xl'>
                    <DialogHeader>
                        <DialogTitle>
                            {currentEditingCriterion?.id.startsWith("new-")
                                ? "Tambah Kriteria Baru"
                                : "Edit Kriteria"}
                        </DialogTitle>
                        <DialogDescription>
                            Sesuaikan detail kriteria dan level penilaian
                        </DialogDescription>
                    </DialogHeader>

                    {currentEditingCriterion && (
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>
                                    Nama Kriteria
                                </label>
                                <Input
                                    value={currentEditingCriterion.name}
                                    onChange={(e) =>
                                        setCurrentEditingCriterion({
                                            ...currentEditingCriterion,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className='space-y-2'>
                                <label className='text-sm font-medium'>
                                    Deskripsi
                                </label>
                                <Textarea
                                    value={currentEditingCriterion.description}
                                    onChange={(e) =>
                                        setCurrentEditingCriterion({
                                            ...currentEditingCriterion,
                                            description: e.target.value,
                                        })
                                    }
                                    rows={2}
                                />
                            </div>

                            <div className='space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label className='text-sm font-medium'>
                                        Bobot (%)
                                    </label>
                                    <span>
                                        {currentEditingCriterion.weight}%
                                    </span>
                                </div>
                                <Slider
                                    value={[currentEditingCriterion.weight]}
                                    onValueChange={(value) =>
                                        setCurrentEditingCriterion({
                                            ...currentEditingCriterion,
                                            weight: value[0],
                                        })
                                    }
                                    min={5}
                                    max={100}
                                    step={5}
                                />
                                <p className='text-xs text-muted-foreground'>
                                    Bobot menentukan kontribusi kriteria ini
                                    terhadap nilai total
                                </p>
                            </div>

                            <div>
                                <label className='text-sm font-medium'>
                                    Level Penilaian
                                </label>
                                <div className='space-y-3 mt-2'>
                                    {currentEditingCriterion.levels.map(
                                        (level, index) => (
                                            <div
                                                key={index}
                                                className='grid grid-cols-4 gap-2 items-center'
                                            >
                                                <div>
                                                    <label className='text-xs text-muted-foreground'>
                                                        Level
                                                    </label>
                                                    <Input
                                                        value={level.value}
                                                        onChange={(e) => {
                                                            const updatedLevels =
                                                                [
                                                                    ...currentEditingCriterion.levels,
                                                                ];
                                                            updatedLevels[
                                                                index
                                                            ] = {
                                                                ...level,
                                                                value: e.target
                                                                    .value,
                                                            };
                                                            setCurrentEditingCriterion(
                                                                {
                                                                    ...currentEditingCriterion,
                                                                    levels: updatedLevels,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div className='col-span-2'>
                                                    <label className='text-xs text-muted-foreground'>
                                                        Deskripsi
                                                    </label>
                                                    <Input
                                                        value={
                                                            level.description
                                                        }
                                                        onChange={(e) => {
                                                            const updatedLevels =
                                                                [
                                                                    ...currentEditingCriterion.levels,
                                                                ];
                                                            updatedLevels[
                                                                index
                                                            ] = {
                                                                ...level,
                                                                description:
                                                                    e.target
                                                                        .value,
                                                            };
                                                            setCurrentEditingCriterion(
                                                                {
                                                                    ...currentEditingCriterion,
                                                                    levels: updatedLevels,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className='text-xs text-muted-foreground'>
                                                        Skor
                                                    </label>
                                                    <Input
                                                        type='number'
                                                        min={0}
                                                        value={level.score}
                                                        onChange={(e) => {
                                                            const updatedLevels =
                                                                [
                                                                    ...currentEditingCriterion.levels,
                                                                ];
                                                            updatedLevels[
                                                                index
                                                            ] = {
                                                                ...level,
                                                                score: Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            };
                                                            setCurrentEditingCriterion(
                                                                {
                                                                    ...currentEditingCriterion,
                                                                    levels: updatedLevels,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setEditCriterionDialogOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSaveCriterion}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog konfirmasi hapus */}
            <Dialog
                open={deleteConfirmDialogOpen}
                onOpenChange={setDeleteConfirmDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Rubrik</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin menghapus rubrik &quot;
                            {rubric.name}&quot;? Tindakan ini tidak dapat
                            dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant='outline'
                            onClick={() => setDeleteConfirmDialogOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            variant='destructive'
                            onClick={confirmDeleteRubric}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
