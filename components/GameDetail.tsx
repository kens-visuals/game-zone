interface Props {
  name: string;
  info: string | number;
}

export default function GameDetail({ name, info }: Props) {
  return (
    <div>
      <span className="mr-2 inline-block text-primary-light">{name}: </span>
      <span className="text-body-1">{info}</span>
    </div>
  );
}
