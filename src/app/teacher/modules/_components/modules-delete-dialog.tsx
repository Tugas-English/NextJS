'use client';

import type { Module } from '@/db/schema';
import type { Row } from '@tanstack/react-table';
import { Loader, Trash } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { deleteModules } from '@/lib/actions/modules';

interface DeleteModulesDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  modules: Row<Module>['original'][];
  showTrigger?: boolean;
  onSuccess?: () => void;
}

export function DeleteModulesDialog({
  modules,
  showTrigger = true,
  onSuccess,
  ...props
}: DeleteModulesDialogProps) {
  const [isDeletePending, startDeleteTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  function onDelete() {
    startDeleteTransition(async () => {
      const { error } = await deleteModules({
        ids: modules.map((module) => module.id),
      });

      if (error) {
        toast.error(error);
        return;
      }
      props.onOpenChange?.(false);
      toast.success('Modul berhasil dihapus');
      onSuccess?.();
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Hapus ({modules.length})
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apakah Anda yakin?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen{' '}
              <span className="font-medium">{modules.length}</span>
              {modules.length === 1 ? ' modul' : ' modul'} dari server.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={isDeletePending}
            >
              {isDeletePending && (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Hapus ({modules.length})
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Apakah Anda yakin?</DrawerTitle>
          <DrawerDescription>
            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permanen{' '}
            <span className="font-medium">{modules.length}</span>
            {modules.length === 1 ? ' modul' : ' modul'} dari server.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Batal</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={isDeletePending}
          >
            {isDeletePending && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Hapus
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
