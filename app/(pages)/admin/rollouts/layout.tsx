import FormContextProvider from '../_contexts/FormContext';

type Props = {
  children: React.ReactNode;
};

export default function RolloutsLayout({ children }: Props) {
  return <FormContextProvider>{children}</FormContextProvider>;
}
