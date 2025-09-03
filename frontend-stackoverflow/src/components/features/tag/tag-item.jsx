export default function TagItem({ tag }) {
  return (
    <div className="border rounded-sm p-3 duration-200 bg-white flex flex-col justify-between">
      <div>
        {/* Tag title */}
        <h1 className="!text-xs font-bold text-gray-800 bg-black/10 w-fit px-1 rounded-xs mb-3">
          {tag.name}
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-[13px] line-clamp-4">
          {tag.description}
        </p>
      </div>

      {/* Example footer: questions count */}
      <div className="mt-3 text-gray-500 text-xs flex justify-between">
        <span>{tag?.questionStats?.total || 0} questions</span>
        <span>
          {tag?.questionStats?.today || 0} asked today,{" "}
          {tag?.questionStats?.week || 0} this week
        </span>
      </div>
    </div>
  );
}
