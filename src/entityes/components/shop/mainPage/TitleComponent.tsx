import { Typography } from "@heroui/react";

const TitleComponent = ({ title }: { title: string }) => {
  return (
    <div className="backDots min-h-12 place-content-center overflow-hidden relative">
      <div className="absolute inset-0 bg-linear-to-r from-0% from-transparent to-white dark:to-default to-60% ">
        <div className="p-2 place-content-center bg-linear-to-r from-0% from-green-300 dark:from-blue-800/90 to-transparent to-65%">
          <Typography type="h3">{title}</Typography>
        </div>
      </div>
    </div>
  );
};

export default TitleComponent;
