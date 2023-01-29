export default function ErrorCard() {
  return (
    <div
      id="alert-additional-content-2"
      className="my-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-900 dark:border-red-900 dark:bg-gray-800 dark:text-red-400"
      role="alert"
    >
      <div className="flex items-center">
        <svg
          aria-hidden="true"
          className="mr-2 h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Error</span>
        <h3 className="text-lg font-medium">Something went wrong!</h3>
      </div>
      <div className="mt-2 mb-4 text-sm">
        We don&apos;t put more info about this error. Because neither you nor we
        care why this happened, we just want it to work! So just click the
        refresh button and hope for the best, because this is an externa API and
        if they decide to abandon it then we&apos;re all f#¢ked!
      </div>
      <div className="flex ">
        <button
          type="button"
          className="inline-flex items-center rounded-lg bg-red-900 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="mr-2 h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refetch
        </button>
      </div>
    </div>
  );
}
