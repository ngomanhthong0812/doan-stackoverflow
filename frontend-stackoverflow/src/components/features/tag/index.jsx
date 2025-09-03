import TagFilter from "./tag-filter";

export default function Tag() {
  return (
    <section className="flex">
      <main className="flex-1">
        <div className="flex flex-col pl-6 gap-4">
          <h1 className="!text-2xl">Tags</h1>
          <p className="max-w-2xl text-gray-600">
            A tag is a keyword or label that categorizes your question with
            other, similar questions. Using the right tags makes it easier for
            others to find and answer your question.
          </p>
        </div>
        <TagFilter />
      </main>
    </section>
  );
}
