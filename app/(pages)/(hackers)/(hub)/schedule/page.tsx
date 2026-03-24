'use client';

import Footer from '@components/Footer/Footer';
import Image from 'next/image';
import headerGrass from '@public/hackers/schedule/header_grass.svg';
import ScheduleControls from '@pages/(hackers)/_components/Schedule/ScheduleControls';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@globals/components/ui/tooltip';
import TooltipCow from '@public/hackers/schedule/vocal_angel_cow.svg';
import DaySection from '@pages/(hackers)/_components/Schedule/DaySection';
import { DAY_KEYS } from '@pages/(hackers)/_components/Schedule/constants';
import { useScheduleData } from '@pages/_hooks/useScheduleData';

export default function Page() {
  const schedule = useScheduleData();

  if (schedule.isError)
    return (
      <main
        id="schedule"
        className="w-full h-screen flex items-center justify-center"
      >
        Oops, an error occured!
      </main>
    );

  return (
    <main
      id="schedule"
      className="relative w-full bg-[#FAFAFF] pt-[calc(100vw*48/380)] lg:pt-[calc(100vw*220/1583)]"
    >
      <div className="absolute top-0 left-0 aspect-[380/75] lg:aspect-[1583/351] w-full z-30 overflow-x-clip pointer-events-none">
        <Image
          src={headerGrass}
          alt="header-grass"
          className="w-[calc(100vw*380/375)] lg:w-[calc(100vw*1583/1440)] margin-auto"
        />
      </div>

      <div className="relative z-10 w-[90%] mx-auto mt-0 flex flex-col gap-6 md:grid md:gap-0 md:grid-cols-[minmax(56px,1fr)_minmax(0,11fr)] md:grid-rows-[auto_auto_1fr] md:gap-x-8">
        <div className="md:col-start-2 md:row-start-1">
          <div className="flex justify-evenly md:justify-start items-center relative border-b-[3px] border-[#E9E9E7]">
            <div className="flex lg:gap-4 items-baseline justify-center md:justify-start w-full">
              <button
                onClick={() => schedule.setActiveTab('schedule')}
                type="button"
                className={`relative text-center md:text-left cursor-pointer font-jakarta text-3xl font-bold leading-normal md:tracking-[0.96px] w-1/2 md:w-auto md:pr-4 pb-2 bg-transparent border-none ${
                  schedule.activeTab === 'schedule'
                    ? 'text-[#3F3F3F] after:content-[""] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-[#3F3F3F] after:z-10'
                    : 'text-[#ACACB9]'
                }`}
              >
                All Events
              </button>
              <div className="w-1/2 md:w-auto">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => schedule.setActiveTab('personal')}
                        type="button"
                        className={`relative text-center md:text-left cursor-pointer font-jakarta text-3xl font-bold leading-normal md:tracking-[0.96px] md:pr-4 pb-2 bg-transparent border-none ${
                          schedule.activeTab === 'personal'
                            ? 'text-[#3F3F3F] after:content-[""] after:absolute after:left-0 after:bottom-[-3px] after:w-full after:h-[3px] after:bg-[#3F3F3F] after:z-10'
                            : 'text-[#ACACB9]'
                        }`}
                      >
                        Personal
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-[#EDFBFA]">
                      <div className="flex gap-4 rounded-full items-center justify-between ">
                        <div className="relative rounded-full w-12 h-12">
                          <Image
                            src={TooltipCow}
                            alt="Tooltip Cow"
                            fill
                          ></Image>
                        </div>

                        <p>Make your own schedule by adding events!</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <ScheduleControls
          activeDay={schedule.activeDay}
          changeActiveDay={schedule.changeActiveDay}
          activeFilters={schedule.activeFilters}
          toggleFilter={schedule.toggleFilter}
          isMobileFilterOpen={schedule.isMobileFilterOpen}
          setIsMobileFilterOpen={schedule.setIsMobileFilterOpen}
        />

        <div className="w-full md:col-start-2 md:row-start-3 mb-[60px] flex flex-col gap-[12px] md:gap-[20px]">
          {schedule.isInitialLoad ? (
            <div>
              <p>loading...</p>
            </div>
          ) : (
            DAY_KEYS.map((dayKey) => (
              <DaySection
                key={dayKey}
                dayKey={dayKey}
                entries={schedule.groupedEntriesByDay[dayKey]}
                activeTab={schedule.activeTab}
                onSwitchToScheduleTab={() => schedule.setActiveTab('schedule')}
                onAddToSchedule={schedule.handleAddToSchedule}
                onRemoveFromSchedule={schedule.handleRemoveFromSchedule}
              />
            ))
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
