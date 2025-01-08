import React, { useState } from "react";
import Modal from "./Modal";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Note, User } from "../types/intakes/note";

interface NotesTableProps {
  projectNotes: Note[];
  setProjectNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  user: User;
  createNoteModalOpen: boolean;
  setCreateNoteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotesTable: React.FC<NotesTableProps> = ({
  projectNotes,
  setProjectNotes,
  user,
  createNoteModalOpen,
  setCreateNoteModalOpen,
}) => {
  const [notes, setNotes] = useState<string>("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [deleteNoteModalOpen, setDeleteNoteModalOpen] =
    useState<boolean>(false);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachedFile(event.target.files[0]);
    }
  };

  const handleSaveNote = () => {
    setCreateNoteModalOpen(false);
    if (!notes) return;

    let uploadedFile = null;
    if (attachedFile) {
      // 假設您有一個上傳檔案的函式，返回上傳後的檔案資訊
      // uploadedFile = await uploadFile(attachedFile);
      uploadedFile = {
        name: attachedFile.name,
        url: URL.createObjectURL(attachedFile),
      };
    }
    if (selectedNote) {
      setProjectNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === selectedNote.id
            ? {
                ...note,
                description: notes,
                timestamp: new Date().toISOString(),
                attachedFile: uploadedFile || note.attachedFile,
              }
            : note
        )
      );
    } else {
      setProjectNotes([
        {
          id: String(projectNotes.length + 1),
          description: notes,
          user: { id: user.id, name: user.name },
          timestamp: new Date().toISOString(),
          attachedFile: uploadedFile,
        },
        ...projectNotes,
      ]);
    }
    setNotes("");
    setAttachedFile(null);
    setSelectedNote(null);
  };

  const handleDeleteNote = () => {
    if (selectedNote) {
      setProjectNotes((prevNotes) =>
        prevNotes.filter((prevNote) => prevNote.id !== selectedNote.id)
      );
    }
    setSelectedNote(null);
    setDeleteNoteModalOpen(false);
  };

  return (
    <div className="mt-2 outline outline-gray-100 rounded-sm">
      <div className="max-h-64 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Description
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                User
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Timestamp
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Attached File
              </th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-left">
            {projectNotes.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  There is no note now
                </td>
              </tr>
            ) : (
              projectNotes.map((note, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {note.description}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {note.user.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatTimestamp(note.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-500">
                    {note.attachedFile ? (
                      <a
                        href={note.attachedFile.url}
                        download={note.attachedFile.name}
                        className="hover:underline"
                      >
                        {note.attachedFile.name}
                      </a>
                    ) : (
                      <span className="text-gray-500">No attachment</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    {user && note.user.id === user.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setNotes(note.description);
                            setSelectedNote(note);
                            setCreateNoteModalOpen(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNote(note);
                            setDeleteNoteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Create or Edit Note */}
      <Modal
        open={createNoteModalOpen}
        onClose={() => setCreateNoteModalOpen(false)}
        title={selectedNote ? "Edit Note" : "Create Note"}
        content={
          <form className="space-y-4 text-left">
            <div>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={notes}
                className="mt-2 block w-full p-2 rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Write something..."
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="fileUpload"
                className="block text-sm font-medium text-gray-700"
              >
                Attach File
              </label>
              <input
                id="fileUpload"
                name="fileUpload"
                type="file"
                className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                onChange={handleFileChange}
              />
              {selectedNote?.attachedFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Current file:{" "}
                  <a
                    href={selectedNote.attachedFile.url}
                    download={selectedNote.attachedFile.name}
                    className="text-blue-500 hover:underline"
                  >
                    {selectedNote.attachedFile.name}
                  </a>
                </p>
              )}
            </div>
          </form>
        }
        confirmLabel="Save"
        confirmAction={handleSaveNote}
        cancelLabel="Cancel"
        cancelAction={() => setCreateNoteModalOpen(false)}
      />

      {/* Modal for Confirm Delete Note */}
      <Modal
        open={deleteNoteModalOpen}
        onClose={() => setDeleteNoteModalOpen(false)}
        title="Delete Note"
        content={
          <div>
            <p className="text-sm text-gray-700">
              Are you sure you want to delete this note?
            </p>
          </div>
        }
        confirmLabel="Delete"
        confirmAction={handleDeleteNote}
        cancelLabel="Cancel"
        cancelAction={() => {
          setSelectedNote(null);
          setDeleteNoteModalOpen(false);
        }}
      />
    </div>
  );
};

export default NotesTable;
