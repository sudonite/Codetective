import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdLogout } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { FaPalette } from "react-icons/fa6";

import { Button } from "@/Components/UI/Button";
import { ScrollArea } from "@/Components/UI/ScrollArea";
import { Tabs, TabsList, TabsTrigger } from "@/Components/UI/Tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/UI/Card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/UI/Select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/Components/UI/DropdownMenu";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/Components/UI/ContextMenu";

import { cn } from "@/Utils";
import { LogoutAPI } from "@/API";
import { Repositories, Repository, StatusType } from "@/Types";

import ThemeChanger from "@/Components/Theme/ThemeChanger";
import AnalyzeDrawer from "@/Components/Dashboard/Analyze/AnalyzeDrawer";
import RepositoryIcon from "@/Components/Dashboard/RepositoryIcon";
import StatusBadge from "@/Components/Dashboard/StatusBadge";
import DeleteDialog from "@/Components/Dashboard/RepositoryDelete";

interface RepositoryAreaProps {
  repositories: Repositories;
  selectedRepository: Repository | null;
  onChange: (repositories: Repositories) => void;
  onClick: (repository: Repository) => void;
  onDelete: (repository: Repository) => void;
}

const RepositoryArea = ({
  repositories,
  selectedRepository,
  onChange,
  onClick,
  onDelete,
}: RepositoryAreaProps) => {
  const navigate = useNavigate();
  const [filteredRepository, setFilteredRepository] = useState<string>("all");
  const [filteredCategory, setFilteredCategory] = useState<string>("all");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteRepository, setDeleteRepository] = useState<Repository | null>(
    null
  );

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteRepository(null);
  };

  const handleLogout = () => {
    LogoutAPI();
    navigate("/");
  };

  const handleDelete = () => {
    if (deleteRepository) {
      onDelete(deleteRepository);
      handleDialogClose();
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="min-h-16 max-h-16 p-2 flex flex-row gap-x-2 items-center border-b">
        <Select
          defaultValue={filteredRepository}
          onValueChange={e => setFilteredRepository(e)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Repository" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>{"All repositories"}</SelectItem>
            {[...new Set(repositories.map(item => item.name))]
              .sort((a: any, b: any) => a.localeCompare(b))
              .map((name, index) => (
                <SelectItem key={index} value={name}>
                  {name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Tabs
          defaultValue={filteredCategory}
          className="w-[400px]"
          onValueChange={e => setFilteredCategory(e)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={"all"}>All</TabsTrigger>
            <TabsTrigger value={"vulnerable"}>Vulnerable</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="grow bg-secondary/50">
        {repositories && repositories.length > 0 ? (
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {repositories
              .filter(
                repo =>
                  filteredRepository === "all" ||
                  repo.name === filteredRepository
              )
              .filter(
                repo =>
                  filteredCategory === "all" ||
                  (filteredCategory === "vulnerable" &&
                    repo.status === StatusType.Vulnerable)
              )
              .sort(
                (a: any, b: any) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .map(repository => (
                <ContextMenu>
                  <ContextMenuTrigger>
                    <Card
                      key={repository.id}
                      className={cn(
                        "m-4 hover:cursor-pointer border rounded-lg",
                        repository.id === selectedRepository?.id
                          ? "bg-primary/50 hover:bg-primary/50 border-primary"
                          : "bg-background hover:bg-accent"
                      )}
                      onClick={() => onClick(repository)}
                    >
                      <CardHeader className="space-y-1 flex flex-row justify-start items-start gap-4">
                        <div className="mt-1 bg-primary/20 rounded-lg p-2">
                          <RepositoryIcon platform={repository.platform} />
                        </div>
                        <div className="grow">
                          <CardTitle>{repository.name}</CardTitle>
                          <CardDescription className="text-md mt-2 w-full">
                            {new Date(repository.date).toDateString()}
                          </CardDescription>
                        </div>
                        <div>
                          <StatusBadge status={repository.status} />
                        </div>
                      </CardHeader>
                    </Card>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-48">
                    <ContextMenuItem
                      inset
                      onClick={() => {
                        setDeleteRepository(repository);
                        setDeleteDialogOpen(true);
                      }}
                      disabled={repository.status === StatusType.Running}
                    >
                      Delete repository
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
          </ScrollArea>
        ) : (
          <div className="flex flex-col h-full justify-center items-center gap-y-4">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              No repositories found
            </h3>
          </div>
        )}
      </div>
      <div className="min-h-16 max-h-16 p-2 flex flex-row items-center justify-between border-t">
        <AnalyzeDrawer repositories={repositories} onChange={onChange} />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <FaPalette className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="p-6 w-96">
              <ThemeChanger />
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings/profile">
              <IoMdSettings className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <MdLogout className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DeleteDialog
        isOpen={deleteDialogOpen}
        name={deleteRepository?.name ?? ""}
        onClose={handleDialogClose}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default RepositoryArea;
