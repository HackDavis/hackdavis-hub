'use client';
import { useState } from 'react';
import styles from './ListInput.module.scss';
import { IoAdd } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';

interface ListInputProps {
  label: string;
  value: any[] | undefined;
  direction?: 'row' | 'column';
  updateValue: (value: any) => void;
  itemRenderer: ({
    key,
    item,
    deleteItem,
    shiftUp,
    shiftDown,
  }: any) => React.ReactNode;
  addRenderer: ({ addItem }: any) => React.ReactNode;
}

export default function ListInput({
  label,
  value = [],
  direction = 'row',
  updateValue,
  itemRenderer,
  addRenderer,
}: ListInputProps) {
  const [adding, setAdding] = useState(false);

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div
        className={styles.input}
        style={{
          flexDirection: direction,
          alignItems: direction === 'column' ? 'flex-start' : 'center',
        }}
      >
        {value.map((item: any, index: number) =>
          itemRenderer({
            key: JSON.stringify(item),
            item,
            deleteItem: () => updateValue(value.toSpliced(index, 1)),
            shiftUp: () => {
              if (index !== 0) {
                const newArr = [...value];
                [newArr[index], newArr[index - 1]] = [
                  newArr[index - 1],
                  newArr[index],
                ];
                updateValue(newArr);
              }
            },
            shiftDown: () => {
              if (index !== value.length - 1) {
                const newArr = [...value];
                [newArr[index], newArr[index + 1]] = [
                  newArr[index + 1],
                  newArr[index],
                ];
                updateValue(newArr);
              }
            },
          })
        )}
        {adding &&
          addRenderer({
            addItem: (newValue: any) => {
              updateValue([...value, newValue]);
              setAdding(false);
            },
          })}
        <div
          className={styles.add_button}
          onClick={() => setAdding((prev) => !prev)}
          style={{
            backgroundColor: adding ? 'var(--text-error)' : '#E0DFD8',
            color: adding ? 'white' : 'black',
          }}
        >
          {adding ? <RxCross1 /> : <IoAdd />}
        </div>
      </div>
    </div>
  );
}
