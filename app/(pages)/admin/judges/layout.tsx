import FormContextProvider from '../_contexts/FormContext';

type Props = {
  children: React.ReactNode;
};

export default function JudgesLayout({ children }: Props) {
  return <FormContextProvider>{children}</FormContextProvider>;
}
