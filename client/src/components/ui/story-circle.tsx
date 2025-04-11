import { User } from "@shared/schema";

interface StoryCircleProps {
  user: User;
  seen?: boolean;
}

const StoryCircle = ({ user, seen = false }: StoryCircleProps) => {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className={`w-16 h-16 rounded-full ${seen ? 'bg-gray-300' : 'bg-gradient-to-r from-primary to-secondary'} p-[2px]`}>
        <img
          src={user.avatar}
          alt={`${user.name}'s story`}
          className="w-full h-full object-cover rounded-full border-2 border-white"
        />
      </div>
      <span className="text-xs font-medium">{user.username}</span>
    </div>
  );
};

export default StoryCircle;
