export default function NotificationDropdown({open}){
  if(!open) return null;

  return(
    <div className="absolute right-0 top-12 bg-[#1f1b36] p-4 rounded-xl w-64 shadow-xl">
      <p>New submission received</p>
      <p>Project deadline approaching</p>
      <p>Feedback submitted</p>
    </div>
  );
}