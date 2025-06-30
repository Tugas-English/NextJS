'use client';

import { useState, useTransition } from 'react';
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

interface ModulesFilterProps {
  skillCounts: Record<string, number>;
  hotsTypeCounts: Record<string, number>;
  difficultyRange: { min: number; max: number };
  selectedSkills: string[];
  selectedHotsTypes: string[];
  selectedDifficulty?: number[];
  search?: string;
}

export default function ModulesFilter({
  skillCounts,
  hotsTypeCounts,
  difficultyRange,
  selectedSkills = [],
  selectedHotsTypes = [],
  selectedDifficulty,
  search = '',
}: ModulesFilterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(search);
  const [skills, setSkills] = useState<string[]>(selectedSkills);
  const [hotsTypes, setHotsTypes] = useState<string[]>(selectedHotsTypes);
  const [difficulty, setDifficulty] = useState<number[]>(
    selectedDifficulty || [difficultyRange.min, difficultyRange.max],
  );

  const skillOptions = Object.entries(skillCounts)
    .filter(([skill]) => skill !== 'undefined')
    .sort(([, countA], [, countB]) => countB - countA);

  const hotsTypeOptions = Object.entries(hotsTypeCounts)
    .filter(([hotsType]) => hotsType !== 'undefined')
    .sort(([, countA], [, countB]) => countB - countA);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();

      if (searchQuery) {
        params.set('search', searchQuery);
      }

      skills.forEach((skill) => {
        params.append('skill', skill);
      });

      hotsTypes.forEach((hotsType) => {
        params.append('hotsType', hotsType);
      });

      if (
        difficulty[0] !== difficultyRange.min ||
        difficulty[1] !== difficultyRange.max
      ) {
        params.set('difficulty', `${difficulty[0]}-${difficulty[1]}`);
      }

      router.push(`/student/modules?${params.toString()}`);
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSkills([]);
    setHotsTypes([]);
    setDifficulty([difficultyRange.min, difficultyRange.max]);

    startTransition(() => {
      router.push('/student/modules');
    });
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    skills.length > 0 ||
    hotsTypes.length > 0 ||
    difficulty[0] !== difficultyRange.min ||
    difficulty[1] !== difficultyRange.max;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 font-medium">
          <Filter className="h-4 w-4" />
          Filter Modul
        </h2>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Cari modul..."
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
                    checked={skills.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSkills([...skills, skill]);
                      } else {
                        setSkills(skills.filter((s) => s !== skill));
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
                    checked={hotsTypes.includes(hotsType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setHotsTypes([...hotsTypes, hotsType]);
                      } else {
                        setHotsTypes(hotsTypes.filter((h) => h !== hotsType));
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
                value={difficulty}
                min={difficultyRange.min}
                max={difficultyRange.max}
                step={1}
                onValueChange={setDifficulty}
              />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Level {difficulty[0]}</span>
                <span>Level {difficulty[1]}</span>
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
