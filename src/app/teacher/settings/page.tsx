"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, User } from "lucide-react";

const profileFormSchema = z.object({
    name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
    email: z.string().email({ message: "Email tidak valid" }),
    phone: z.string().optional(),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
});

const securityFormSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, { message: "Password saat ini diperlukan" }),
        newPassword: z
            .string()
            .min(8, { message: "Password baru minimal 8 karakter" }),
        confirmPassword: z
            .string()
            .min(8, { message: "Konfirmasi password diperlukan" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Password baru dan konfirmasi tidak cocok",
        path: ["confirmPassword"],
    });

// Schema validasi untuk form notifikasi
const notificationsFormSchema = z.object({
    emailNotifications: z.boolean().default(true),
    assignmentReminders: z.boolean().default(true),
    submissionNotifications: z.boolean().default(true),
    discussionNotifications: z.boolean().default(true),
    challengeNotifications: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export default function SettingsPage() {
    // Form untuk profil
    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: "Ms. Johnson",
            email: "teacher@example.com",
            phone: "+62 812-3456-7890",
            bio: "Guru Bahasa Inggris dengan pengalaman 10 tahun mengajar. Fokus pada pengembangan keterampilan berpikir kritis dan komunikasi efektif.",
            avatarUrl: "/avatars/teacher.jpg",
        },
    });

    const securityForm = useForm<SecurityFormValues>({
        resolver: zodResolver(securityFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const notificationsForm = useForm<NotificationsFormValues>({
        resolver: zodResolver(notificationsFormSchema),
        defaultValues: {
            emailNotifications: true,
            assignmentReminders: true,
            submissionNotifications: true,
            discussionNotifications: true,
            challengeNotifications: true,
        },
    });

    async function onProfileSubmit(data: ProfileFormValues) {
        try {
            console.log("Profile data:", data);
            // Implementasi API call untuk menyimpan profil
            // await updateProfile(data);

            // Tampilkan notifikasi sukses
            alert("Profil berhasil diperbarui!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat memperbarui profil");
        }
    }

    async function onSecuritySubmit(data: SecurityFormValues) {
        try {
            console.log("Security data:", data);
            // Implementasi API call untuk mengubah password
            // await changePassword(data);

            // Tampilkan notifikasi sukses
            alert("Password berhasil diubah!");
            securityForm.reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat mengubah password");
        }
    }

    async function onNotificationsSubmit(data: NotificationsFormValues) {
        try {
            console.log("Notifications data:", data);
            // Implementasi API call untuk menyimpan pengaturan notifikasi
            // await updateNotificationSettings(data);

            // Tampilkan notifikasi sukses
            alert("Pengaturan notifikasi berhasil disimpan!");
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat menyimpan pengaturan notifikasi");
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Pengaturan</h1>
            </div>

            <Tabs defaultValue='profile'>
                <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger
                        value='profile'
                        className='flex items-center gap-2'
                    >
                        <User className='h-4 w-4' />
                        <span>Profil</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='security'
                        className='flex items-center gap-2'
                    >
                        <Lock className='h-4 w-4' />
                        <span>Keamanan</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value='notifications'
                        className='flex items-center gap-2'
                    >
                        <Bell className='h-4 w-4' />
                        <span>Notifikasi</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value='profile' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Profil</CardTitle>
                            <CardDescription>
                                Kelola informasi profil Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form
                                    onSubmit={profileForm.handleSubmit(
                                        onProfileSubmit
                                    )}
                                    className='space-y-6'
                                >
                                    <div className='flex items-center gap-4'>
                                        <Avatar className='h-20 w-20'>
                                            <AvatarImage
                                                src={profileForm.getValues(
                                                    "avatarUrl"
                                                )}
                                                alt='Ms. Johnson'
                                            />
                                            <AvatarFallback>MJ</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <FormField
                                                control={profileForm.control}
                                                name='avatarUrl'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type='file'
                                                                accept='image/*'
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    // Handle file upload logic
                                                                    if (
                                                                        e.target
                                                                            .files &&
                                                                        e.target
                                                                            .files[0]
                                                                    ) {
                                                                        // Dalam implementasi sebenarnya, upload file ke server
                                                                        // dan dapatkan URL-nya
                                                                        field.onChange(
                                                                            "/avatars/teacher.jpg"
                                                                        );
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Unggah foto profil
                                                            baru
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <FormField
                                            control={profileForm.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nama</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Masukkan nama Anda'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={profileForm.control}
                                            name='email'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder='Masukkan email Anda'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={profileForm.control}
                                        name='phone'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Nomor Telepon
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder='Masukkan nomor telepon Anda'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Opsional, untuk keperluan
                                                    kontak
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={profileForm.control}
                                        name='bio'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Ceritakan tentang diri Anda'
                                                        rows={4}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Informasi singkat tentang
                                                    diri Anda
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='flex justify-end'>
                                        <Button type='submit'>
                                            Simpan Perubahan
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='security' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Keamanan</CardTitle>
                            <CardDescription>
                                Kelola pengaturan keamanan akun Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...securityForm}>
                                <form
                                    onSubmit={securityForm.handleSubmit(
                                        onSecuritySubmit
                                    )}
                                    className='space-y-6'
                                >
                                    <FormField
                                        control={securityForm.control}
                                        name='currentPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Password Saat Ini
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder='Masukkan password saat ini'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={securityForm.control}
                                        name='newPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Password Baru
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder='Masukkan password baru'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Password minimal 8 karakter
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={securityForm.control}
                                        name='confirmPassword'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Konfirmasi Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type='password'
                                                        placeholder='Konfirmasi password baru'
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className='flex justify-end'>
                                        <Button type='submit'>
                                            Ubah Password
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value='notifications' className='mt-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifikasi</CardTitle>
                            <CardDescription>
                                Atur preferensi notifikasi Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...notificationsForm}>
                                <form
                                    onSubmit={notificationsForm.handleSubmit(
                                        onNotificationsSubmit
                                    )}
                                    className='space-y-6'
                                >
                                    <FormField
                                        control={notificationsForm.control}
                                        name='emailNotifications'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                                <div className='space-y-0.5'>
                                                    <FormLabel className='text-base'>
                                                        Notifikasi Email
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Terima notifikasi
                                                        melalui email
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={notificationsForm.control}
                                        name='assignmentReminders'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                                <div className='space-y-0.5'>
                                                    <FormLabel className='text-base'>
                                                        Pengingat Tugas
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Terima pengingat tentang
                                                        tenggat tugas
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={notificationsForm.control}
                                        name='submissionNotifications'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                                <div className='space-y-0.5'>
                                                    <FormLabel className='text-base'>
                                                        Notifikasi Pengumpulan
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Terima notifikasi saat
                                                        siswa mengumpulkan tugas
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={notificationsForm.control}
                                        name='discussionNotifications'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                                <div className='space-y-0.5'>
                                                    <FormLabel className='text-base'>
                                                        Notifikasi Diskusi
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Terima notifikasi
                                                        tentang aktivitas di
                                                        forum diskusi
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={notificationsForm.control}
                                        name='challengeNotifications'
                                        render={({ field }) => (
                                            <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                                                <div className='space-y-0.5'>
                                                    <FormLabel className='text-base'>
                                                        Notifikasi Tantangan
                                                    </FormLabel>
                                                    <FormDescription>
                                                        Terima notifikasi
                                                        tentang tantangan
                                                        mingguan
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <div className='flex justify-end'>
                                        <Button type='submit'>
                                            Simpan Pengaturan
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
