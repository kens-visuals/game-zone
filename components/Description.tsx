import { useState } from 'react';

interface Props {
  description: string;
}

export default function Description({ description }: Props) {
  const [isShowMore, setIsShowMore] = useState(false);

  return (
    <div className="mt-4">
      <h3 className="text-h2-light mix-blend-overlay">About</h3>

      <div
        className={`mt-1 h-32 max-w-lg space-y-4 overflow-y-hidden text-body-1 text-white/70 ${
          isShowMore && 'h-auto overflow-y-visible'
        }`}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: description }}
      />
      <button
        type="button"
        onClick={() => setIsShowMore((prevState) => !prevState)}
        className="mt-2 text-body-1"
      >
        {isShowMore ? 'Show Less' : 'Read More'}
      </button>
    </div>
  );
}
