interface Props {
  heading: string;
}

export default function PageHeading({ heading }: Props) {
  return <h1 className="mb-4 text-4xl font-bold lg:text-6xl">{heading}</h1>;
}
