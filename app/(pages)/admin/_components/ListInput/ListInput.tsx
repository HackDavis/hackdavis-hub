'use client';
import { useState } from 'react';
import styles from './ListInput.module.scss';
import { IoAdd } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';

interface ListInputProps {
  label: string;
  value: any[] | undefined;
  onUpdate: (value: any) => void;
  itemRenderer: ({ key, item, deleteItem }: any) => React.ReactNode;
  addRenderer: ({ onAdd }: any) => React.ReactNode;
}

export default function ListInput({
  label,
  value = [],
  onUpdate,
  itemRenderer,
  addRenderer,
}: ListInputProps) {
  const [adding, setAdding] = useState(true);

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.input}>
        {value.map((item: any, index: number) =>
          itemRenderer({
            key: JSON.stringify(item),
            item,
            deleteItem: () => onUpdate(value.toSpliced(index, 1)),
          })
        )}
        {adding && addRenderer({ onAdd: value })}
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
