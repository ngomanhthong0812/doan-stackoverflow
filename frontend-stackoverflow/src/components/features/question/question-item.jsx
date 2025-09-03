export default function QuestionItem({
  href = "#",
  title = "C# form.cs window has been edited in Visual Studio but the changes doesn't show when I run the project",
  excerpt = `I edited the contents of the DataGridView in an already existing project and I even double-checked the form's Designer.cs file and I'm positive that the new DataGridViewComboBoxColumns are there...`,
  tags = ["c#", "designer"],
  votes = 0,
  answers = 0,
  views = 14,
  author = { name: "Anpo Desu", rep: 381, avatar: "" },
  asked = "asked 28 mins ago",
}) {
  return (
    <article
      className="
        group flex gap-3 p-4
        border-b border-gray-200
        transition-colors
      "
      role="listitem"
    >
      {/* Left */}
      <div className="flex flex-col items-end justify-start gap-2 text-xs">
        <StatBox label="votes" value={votes} />
        <StatBox
          label="answers"
          value={answers}
          // tô nổi bật nếu có câu trả lời
          className={
            answers > 0
              ? "border-green-500 text-green-700 dark:text-green-400"
              : ""
          }
        />
        <div className="text-gray-500 px-2">{views} views</div>
      </div>

      {/* Middle: title, excerpt, tags, account */}
      <div>
        <a
          href={href}
          className="
            text-[17px] leading-snug
            text-[#1b75d0] hover:text-[#155ca2]
            focus:outline-none focus:ring-2 focus:ring-blue-400 rounded
            dark:text-blue-400 dark:hover:text-blue-300
          "
          aria-label={title}
        >
          {title}
        </a>

        {/* excerpt */}
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center justify-between gap-2 mt-3">
          {/* tags */}
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t}
                className="
                inline-flex items-center rounded-sm px-2 py-1 text-xs
                bg-gray-200 border-gray-500 text-black font-medium
              "
              >
                {t}
              </li>
            ))}
          </ul>

          {/* account */}
          <div className="flex">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {author.avatar ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="font-medium text-[#1b75d0] hover:text-[#155ca2]"
                >
                  {author.name}
                </a>
                <span className="font-medium">{author.rep}</span>
                <span className="text-gray-500">• {asked}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatBox({ value, label, className = "" }) {
  return (
    <div
      className={`
       px-2 py-1 flex gap-1
        border-gray-300 text-gray-700 tex-xs
        items-center justify-center
        ${className}
      `}
      aria-label={`${value} ${label}`}
    >
      <p>{value}</p>
      <p>{label}</p>
    </div>
  );
}
