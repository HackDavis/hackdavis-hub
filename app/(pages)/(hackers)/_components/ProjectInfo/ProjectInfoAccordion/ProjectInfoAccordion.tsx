'use client';

import { Accordion, AccordionItem } from '@szhsin/react-accordion';
import styles from './ProjectInfoAccordion.module.scss';
import { Chevron, Star } from './AccordionAssets';

export interface AccordionItemInt {
  subtitle: string;
  title: string;
  content: React.ReactNode;
}

export default function ProjectInfoAccordion({
  accordionItems,
}: {
  accordionItems: AccordionItemInt[];
}) {
  return (
    <Accordion transition transitionTimeout={250} allowMultiple>
      {accordionItems.map((accordionItem, index) => (
        <AccordionItem
          key={index}
          header={
            <div
              className={styles.item_header}
              style={{
                backgroundColor: index % 2 == 0 ? '#005271' : '#9EE7E5',
              }}
            >
              <div className={styles.left}>
                <div className={styles.star}>
                  <Star fill={index % 2 == 0 ? 'white' : '#123041'} />
                </div>
                <div className={styles.header_text}>
                  <h5
                    style={{
                      color:
                        index % 2 == 0
                          ? 'rgba(255, 255, 255, 0.75)'
                          : 'rgba(23, 58, 82, 0.75)',
                    }}
                  >
                    {accordionItem.subtitle}
                  </h5>
                  <h4
                    style={{
                      color: index % 2 == 0 ? 'white' : '#123041',
                    }}
                  >
                    {accordionItem.title}
                  </h4>
                </div>
              </div>

              <div className={`${styles.chevron} ${styles.active}`}>
                <Chevron fill={index % 2 == 0 ? 'white' : '#123041'} />
              </div>
            </div>
          }
          buttonProps={{
            className: ({ isEnter }: { isEnter: boolean }) =>
              `${styles.item_button} ${
                isEnter ? styles.item_button_expanded : ''
              }`,
          }}
          contentProps={{ className: styles.item_content }}
        >
          {accordionItem.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
