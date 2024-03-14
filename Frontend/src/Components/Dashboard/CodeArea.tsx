const CodeArea = () => {
  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 max-h-16 p-2 flex flex-row gap-x-2 items-center border-b">
        <h1 className="text-center">TopBar</h1>
      </div>
      <div className="grow">Content</div>
      <div className="h-16 max-h-16 p-2 flex flex-row items-center justify-between border-t">
        BottomBar
      </div>
    </div>
  );
};

export default CodeArea;
