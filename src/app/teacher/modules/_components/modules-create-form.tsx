"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import React, { useState } from "react";
import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { moduleSchema, ModuleFormValues } from "@/lib/schemas/module";
import { createModule } from "@/lib/actions/modules";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Activity {
    id: string;
    title: string;
    skill: string;
    hotsType: string;
    difficulty: number;
}

interface SelectedActivity extends Activity {
    id: string; // ID baru yang digenerate
    activityId: string; // ID asli dari activity
    isRequired: boolean;
    order: number;
}

interface CreateModuleFormProps {
    activitiesPromise: Promise<
        {
            id: string;
            title: string;
            skill: string;
            hotsType: string;
            difficulty: number;
        }[]
    >;
}
export default function CreateModuleForm({
    activitiesPromise,
}: CreateModuleFormProps) {
    const activities = React.use(activitiesPromise);
    const [selectedActivities, setSelectedActivities] = useState<
        SelectedActivity[]
    >([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<ModuleFormValues>({
        resolver: zodResolver(moduleSchema),
        defaultValues: {
            title: "",
            description: "",
            difficulty: 3,
            isPublished: false,
            activities: [],
        },
    });

    const addActivity = (activity: Activity) => {
        setSelectedActivities([
            ...selectedActivities,
            {
                id: crypto.randomUUID(),
                activityId: activity.id,
                title: activity.title,
                skill: activity.skill,
                difficulty: activity.difficulty,
                hotsType: activity.hotsType,
                isRequired: true,
                order: selectedActivities.length + 1,
            },
        ]);
    };
    const removeActivity = (index: number) => {
        const newActivities = [...selectedActivities];
        newActivities.splice(index, 1);

        const updatedActivities = newActivities.map((activity, idx) => ({
            ...activity,
            order: idx + 1,
        }));

        setSelectedActivities(updatedActivities);
    };

    const toggleRequired = (index: number) => {
        const newActivities = [...selectedActivities];
        newActivities[index].isRequired = !newActivities[index].isRequired;
        setSelectedActivities(newActivities);
    };

    const moveActivity = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= selectedActivities.length) return;

        const newActivities = [...selectedActivities];
        const [movedItem] = newActivities.splice(fromIndex, 1);
        newActivities.splice(toIndex, 0, movedItem);

        const updatedActivities = newActivities.map((activity, idx) => ({
            ...activity,
            order: idx + 1,
        }));

        setSelectedActivities(updatedActivities);
    };

    async function onSubmit(data: ModuleFormValues) {
        setIsSubmitting(true);

        try {
            data.activities = selectedActivities;

            const result = await createModule(data);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Modul berhasil dibuat!");
            router.push("/teacher/modules");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan saat membuat modul"
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Buat Modul Pembelajaran</h1>
                <Button variant='outline' asChild>
                    <Link href='/teacher/modules'>Kembali</Link>
                </Button>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Detail Modul</CardTitle>
                            <CardDescription>
                                Lengkapi detail untuk modul pembelajaran baru
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <FormField
                                control={form.control}
                                name='title'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Judul Modul</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Masukkan judul modul'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder='Masukkan deskripsi modul'
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='grid grid-cols-2 gap-4'>
                                <FormField
                                    control={form.control}
                                    name='skill'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Skill (Opsional)
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih skill' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='reading'>
                                                        Reading
                                                    </SelectItem>
                                                    <SelectItem value='listening'>
                                                        Listening
                                                    </SelectItem>
                                                    <SelectItem value='writing'>
                                                        Writing
                                                    </SelectItem>
                                                    <SelectItem value='speaking'>
                                                        Speaking
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Opsional untuk memfilter
                                                aktivitas
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='hotsType'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tipe HOTS (Opsional)
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Pilih tipe HOTS' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='analyze'>
                                                        Analyze
                                                    </SelectItem>
                                                    <SelectItem value='evaluate'>
                                                        Evaluate
                                                    </SelectItem>
                                                    <SelectItem value='create'>
                                                        Create
                                                    </SelectItem>
                                                    <SelectItem value='problem-solve'>
                                                        Problem Solve
                                                    </SelectItem>
                                                    <SelectItem value='infer'>
                                                        Infer
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Opsional untuk memfilter
                                                aktivitas
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name='difficulty'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tingkat Kesulitan: {field.value}
                                        </FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={1}
                                                max={5}
                                                step={1}
                                                value={[field.value]}
                                                onValueChange={(vals) =>
                                                    field.onChange(vals[0])
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            1 (Mudah) hingga 5 (Sangat Sulit)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='coverImage'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gambar Sampul</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='text'
                                                placeholder='URL gambar sampul'
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Masukkan URL gambar sampul untuk
                                            modul ini
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Aktivitas dalam Modul</CardTitle>
                            <CardDescription>
                                Tambahkan dan atur urutan aktivitas dalam modul
                                ini
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <div className='border rounded-md p-4'>
                                <h3 className='text-sm font-medium mb-3'>
                                    Aktivitas yang Dipilih
                                </h3>
                                {selectedActivities.length === 0 ? (
                                    <p className='text-sm text-muted-foreground'>
                                        Belum ada aktivitas yang dipilih.
                                        Tambahkan aktivitas dari daftar di
                                        bawah.
                                    </p>
                                ) : (
                                    <div className='space-y-2'>
                                        {selectedActivities.map(
                                            (activity, index) => (
                                                <div
                                                    key={`${activity.id}-${index}`}
                                                    className='flex items-center justify-between border rounded-md p-3'
                                                >
                                                    <div className='flex items-center gap-3'>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            className='cursor-grab'
                                                            onClick={(e) =>
                                                                e.preventDefault()
                                                            }
                                                        >
                                                            <GripVertical className='h-4 w-4' />
                                                        </Button>
                                                        <div className='flex-1'>
                                                            <p className='text-sm font-medium'>
                                                                {activity.title}
                                                            </p>
                                                            <div className='flex items-center gap-2 mt-1'>
                                                                {activity.skill && (
                                                                    <Badge
                                                                        variant='outline'
                                                                        className='text-xs'
                                                                    >
                                                                        {
                                                                            activity.skill
                                                                        }
                                                                    </Badge>
                                                                )}
                                                                {activity.hotsType && (
                                                                    <Badge
                                                                        variant='secondary'
                                                                        className='text-xs'
                                                                    >
                                                                        {
                                                                            activity.hotsType
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-2'>
                                                        <div className='flex items-center gap-2'>
                                                            <Checkbox
                                                                id={`required-${index}`}
                                                                checked={
                                                                    activity.isRequired
                                                                }
                                                                onCheckedChange={() =>
                                                                    toggleRequired(
                                                                        index
                                                                    )
                                                                }
                                                            />
                                                            <label
                                                                htmlFor={`required-${index}`}
                                                                className='text-sm'
                                                            >
                                                                Wajib
                                                            </label>
                                                        </div>
                                                        <div className='flex items-center gap-1'>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    moveActivity(
                                                                        index,
                                                                        index -
                                                                            1
                                                                    );
                                                                }}
                                                                disabled={
                                                                    index === 0
                                                                }
                                                            >
                                                                ↑
                                                            </Button>
                                                            <Button
                                                                variant='ghost'
                                                                size='sm'
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    moveActivity(
                                                                        index,
                                                                        index +
                                                                            1
                                                                    );
                                                                }}
                                                                disabled={
                                                                    index ===
                                                                    selectedActivities.length -
                                                                        1
                                                                }
                                                            >
                                                                ↓
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant='ghost'
                                                            size='sm'
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                removeActivity(
                                                                    index
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className='h-4 w-4' />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className='text-sm font-medium mb-3'>
                                    Aktivitas yang Tersedia
                                </h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    {activities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className='border rounded-md p-3 flex items-center justify-between'
                                        >
                                            <div>
                                                <p className='text-sm font-medium'>
                                                    {activity.title}
                                                </p>
                                                <div className='flex items-center gap-2 mt-1'>
                                                    {activity.skill && (
                                                        <Badge
                                                            variant='outline'
                                                            className='text-xs'
                                                        >
                                                            {activity.skill}
                                                        </Badge>
                                                    )}
                                                    {activity.hotsType && (
                                                        <Badge
                                                            variant='secondary'
                                                            className='text-xs'
                                                        >
                                                            {activity.hotsType}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                variant='ghost'
                                                size='sm'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addActivity(activity);
                                                }}
                                                disabled={selectedActivities.some(
                                                    (a) =>
                                                        a.activityId ===
                                                        activity.id
                                                )}
                                            >
                                                <Plus className='h-4 w-4' />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pengaturan Publikasi</CardTitle>
                            <CardDescription>
                                Atur status publikasi modul
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name='isPublished'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base'>
                                                Publikasikan Sekarang
                                            </FormLabel>
                                            <FormDescription>
                                                Modul akan langsung tersedia
                                                untuk siswa
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className='flex justify-end gap-2'>
                        <Button
                            variant='outline'
                            type='button'
                            onClick={() => router.push("/teacher/modules")}
                        >
                            Batal
                        </Button>
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan Modul"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
