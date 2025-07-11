'use client';

import type { Activity } from '@/db/schema';
import type { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ActivitiesTableToolbarActionsProps {
  table: Table<Activity>;
}

export function TasksTableToolbarActions({
  table,
}: ActivitiesTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Download />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
