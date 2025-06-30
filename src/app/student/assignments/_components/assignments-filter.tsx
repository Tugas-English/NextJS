'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { getAssignmentFilters } from '@/lib/actions/student-assignments';

interface AssignmentsFilterProps {
  search?: string;
  skill: string[];
  hotsType: string[];
  difficulty?: number[];
  status: string;
  tab: string;
}

export default function AssignmentsFilter({
  search = '',
  skill = [],
  hotsType = [],
  difficulty,
  status,
  tab,
}: AssignmentsFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(search);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(skill);
  const [selectedHotsTypes, setSelectedHotsTypes] =
    useState<string[]>(hotsType);
  const [difficultyRange, setDifficultyRange] = useState<number[]>(
    difficulty || [1, 5],
  );

  const [filters, setFilters] = useState<{
    skills: Record<string, number>;
    hotsTypes: Record<string, number>;
    difficultyRange: { min: number; max: number };
  }>({
    skills: {},
    hotsTypes: {},
    difficultyRange: { min: 1, max: 5 },
  });

  // Ambil data filter
  useEffect(() => {
    async function fetchFilters() {
      const filterData = await getAssignmentFilters();
      setFilters(filterData);

      if (!difficulty) {
        setDifficultyRange([
          filterData.difficultyRange.min,
          filterData.difficultyRange.max,
        ]);
      }
    }

    fetchFilters();
  }, [difficulty]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();

      // Selalu sertakan tab
      params.set('tab', tab);

      if (searchQuery) {
        params.set('search', searchQuery);
      }

      selectedSkills.forEach((skill) => {
        params.append('skill', skill);
      });

      selectedHotsTypes.forEach((hotsType) => {
        params.append('hotsType', hotsType);
      });

      if (
        difficultyRange[0] !== filters.difficultyRange.min ||
        difficultyRange[1] !== filters.difficultyRange.max
      ) {
        params.set('difficulty', `${difficultyRange[0]}-${difficultyRange[1]}`);
      }

      // Sertakan status
      params.set('status', status);

      router.push(`/student/assignments?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSkills([]);
    setSelectedHotsTypes([]);
    setDifficultyRange([
      filters.difficultyRange.min,
      filters.difficultyRange.max,
    ]);

    startTransition(() => {
      router.push(`/student/assignments?tab=${tab}`);
    });
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedSkills.length > 0 ||
    selectedHotsTypes.length > 0 ||
    difficultyRange[0] !== filters.difficultyRange.min ||
    difficultyRange[1] !== filters.difficultyRange.max;

  const skillOptions = Object.entries(filters.skills)
    .filter(([skill]) => skill !== 'undefined')
    .sort(([, countA], [, countB]) => countB - countA);

  const hotsTypeOptions = Object.entries(filters.hotsTypes)
    .filter(([hotsType]) => hotsType !== 'undefined')
    .sort(([, countA], [, countB]) => countB - countA);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 font-medium">
          <Filter className="h-4 w-4" />
          Filter Tugas
        </h2>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Cari tugas..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm">
            Cari
          </Button>
        </form>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground flex w-full gap-2"
            onClick={resetFilters}
          >
            <X className="h-4 w-4" />
            Reset Filter
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={['skill', 'hots', 'difficulty']}
        className="w-full"
      >
        <AccordionItem value="skill">
          <AccordionTrigger className="text-sm font-medium">
            Skill Bahasa
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {skillOptions.map(([skill, count]) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={selectedSkills.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSkills([...selectedSkills, skill]);
                      } else {
                        setSelectedSkills(
                          selectedSkills.filter((s) => s !== skill),
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`skill-${skill}`}
                    className="flex w-full items-center justify-between text-sm capitalize"
                  >
                    {skill}
                    <Badge variant="outline">{count}</Badge>
                  </Label>
                </div>
              ))}

              {skillOptions.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Tidak ada data skill
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="hots">
          <AccordionTrigger className="text-sm font-medium">
            Tipe HOTS
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {hotsTypeOptions.map(([hotsType, count]) => (
                <div key={hotsType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`hots-${hotsType}`}
                    checked={selectedHotsTypes.includes(hotsType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHotsTypes([...selectedHotsTypes, hotsType]);
                      } else {
                        setSelectedHotsTypes(
                          selectedHotsTypes.filter((h) => h !== hotsType),
                        );
                      }
                    }}
                  />
                  <Label
                    htmlFor={`hots-${hotsType}`}
                    className="flex w-full items-center justify-between text-sm capitalize"
                  >
                    {hotsType}
                    <Badge variant="outline">{count}</Badge>
                  </Label>
                </div>
              ))}

              {hotsTypeOptions.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  Tidak ada data tipe HOTS
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="difficulty">
          <AccordionTrigger className="text-sm font-medium">
            Tingkat Kesulitan
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                value={difficultyRange}
                min={filters.difficultyRange.min}
                max={filters.difficultyRange.max}
                step={1}
                onValueChange={setDifficultyRange}
              />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Level {difficultyRange[0]}</span>
                <span>Level {difficultyRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={applyFilters} disabled={isPending}>
        Terapkan Filter
      </Button>
    </div>
  );
}
