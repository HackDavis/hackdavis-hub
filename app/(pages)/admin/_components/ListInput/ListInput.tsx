'use client';
import { useState } from 'react';
import styles from './ListInput.module.scss';
import { IoAdd } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';

interface ListInputProps {
  label: string;
  value: any[] | undefined;
  updateValue: (value: any) => void;
  itemRenderer: ({ key, item, deleteItem }: any) => React.ReactNode;
  addRenderer: ({ addItem }: any) => React.ReactNode;
}

export default function ListInput({
  label,
  value = [],
  updateValue,
  itemRenderer,
  addRenderer,
}: ListInputProps) {
  const [adding, setAdding] = useState(false);

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.input}>
        {value.map((item: any, index: number) =>
          itemRenderer({
            key: JSON.stringify(item),
            item,
            deleteItem: () => updateValue(value.toSpliced(index, 1)),
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
