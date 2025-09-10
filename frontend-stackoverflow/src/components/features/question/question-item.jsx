import { formatTimeAgo } from "@/utils/format-time-ago";
import { Link } from "@tanstack/react-router";

export default function QuestionItem({
  _id,
  title,
  content,
  tags = [],
  upvotes = [],
  answersCount = 0,
  views = 0,
  author = { username: "Anonymous", reputation: 0, avatar: "" },
  createdAt,
}) {
  const votes = upvotes.length;
  return (
    <article
      className="group flex gap-3 p-4 border-b border-gray-200 transition-colors"
      role="listitem"
    >
      {/* Left */}
      <div className="flex flex-col items-end justify-start gap-2 text-xs">
        <StatBox label="votes" value={votes} />
        <StatBox
          label="answers"
          value={answersCount}
          className={
            answersCount > 0
              ? "border-green-500 text-green-700 dark:text-green-400"
              : ""
          }
        />
        <div className="text-gray-500 px-2">{views} views</div>
      </div>

      {/* Middle */}
      <div className="w-full">
        <Link
          to={`/questions/${_id}`}
          className="text-[17px] line-clamp-2 leading-snug text-[#1b75d0] hover:text-[#155ca2] focus:outline-none focus:ring-2 focus:ring-blue-400 rounded dark:text-blue-400 dark:hover:text-blue-300"
          aria-label={title}
        >
          {title}
        </Link>

        {/* excerpt (lấy content rút gọn) */}
        <div
          className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 [&_img]:hidden"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="flex items-center justify-between gap-2 mt-3">
          {/* tags */}
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t._id || t}
                className="inline-flex items-center rounded-sm px-2 py-1 text-xs bg-gray-200 border-gray-500 text-black font-medium"
              >
                {t.name || t}
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
                    alt={author.username}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="font-medium text-[#1b75d0] hover:text-[#155ca2]"
                >
                  {author.username}
                </a>
                <span className="font-medium">{author.reputation}</span>
                <span className="text-gray-500">
                  • {formatTimeAgo(createdAt)}
                </span>
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
      className={`px-2 py-1 flex gap-1 border-gray-300 text-gray-700 tex-xs items-center justify-center ${className}`}
      aria-label={`${value} ${label}`}
    >
      <p>{value}</p>
      <p>{label}</p>
    </div>
  );
}
