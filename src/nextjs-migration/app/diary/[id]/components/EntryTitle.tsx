
interface EntryTitleProps {
  title: string;
}

export default function EntryTitle({ title }: EntryTitleProps) {
  return (
    <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
  );
}
