import { useState, useEffect } from "react";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const baseClassName =
  "pl-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

interface ResponsiveDropdownsProps {
  initialMinistry?: string;
  initialDivision?: string;
  initialBranch?: string;
  onChangeMinistry?: (ministry: string) => void;
  onChangeDivision?: (division: string) => void;
  onChangeBranch?: (branch: string) => void;
  displayBranch?: boolean;
}

export default function ResponsiveDropdowns({
  initialMinistry = "",
  initialDivision = "",
  initialBranch = "",
  onChangeMinistry,
  onChangeDivision,
  onChangeBranch,
  displayBranch = true,
}: ResponsiveDropdownsProps) {
  const [divisions, setDivisions] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedMinistry, setSelectedMinistry] =
    useState<string>(initialMinistry);
  const [selectedDivision, setSelectedDivision] =
    useState<string>(initialDivision);
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranch);


  const [ministryOptions, setMinistryOptions] = useState<string[]>([]);
  const [dropdownLoading, setDropdownLoading] = useState(true);
  const [dropdownError, setDropdownError] = useState("");


  // 當初始值改變時更新部門和分支數據
  useEffect(() => {
    if (initialMinistry) {
      setSelectedMinistry(initialMinistry);

      // Fetch divisions for the initial ministry
      fetch(`${apiUrl}/organizations?ministry=${initialMinistry}`)
        .then((res) => res.json())
        .then((data) => {
          setDivisions(data);
          if (initialDivision) {
            setSelectedDivision(initialDivision);

            // Fetch branches for the initial division
            fetch(`${apiUrl}/organizations?division=${initialDivision}`)
              .then((res) => res.json())
              .then((branchData) => {
                setBranches(branchData);
                if (initialBranch) {
                  setSelectedBranch(initialBranch);
                }
              })
              .catch((err) => console.error("Failed to fetch branches:", err));
          }
        })
        .catch((err) => console.error("Failed to fetch divisions:", err));
    }
  }, [initialMinistry, initialDivision, initialBranch]);

    const fetchDropdown = async () => {
      try {
        const response = await fetch(`${apiUrl}/dropdowns?moduleId=101&pageType=createProject`);
        const data = await response.json();
        setMinistryOptions(data["Ministry"]);
      } catch (error) {
        setDropdownError(String(error));
      } finally {
        setDropdownLoading(false);
      }
    }
  
    useEffect(() => {
      fetchDropdown();
    }, []);

  const handleMinistryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ministry = e.target.value;
    setSelectedMinistry(ministry);
    setSelectedDivision("");
    setSelectedBranch("");
    setDivisions([]);
    setBranches([]);

    if (onChangeMinistry) onChangeMinistry(ministry);

    // Fetch divisions based on selected ministry
    fetch(`${apiUrl}/organizations?ministry=${ministry}`)
      .then((res) => res.json())
      .then((data) => setDivisions(data))
      .catch((err) => console.error("Failed to fetch divisions:", err));
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const division = e.target.value;
    setSelectedDivision(division);
    setSelectedBranch("");
    setBranches([]);

    if (onChangeDivision) onChangeDivision(division);

    // Fetch branches based on selected division
    fetch(`${apiUrl}/organizations?division=${division}`)
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error("Failed to fetch branches:", err));
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branch = e.target.value;
    setSelectedBranch(branch);
    if (onChangeBranch) onChangeBranch(branch);
  };

  if (dropdownLoading) {
    return <div>Loading...</div>;
  }

  if (dropdownError) {
    return <div>Error: {dropdownError}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Ministry Dropdown */}
      <div>
        <label className="block font-medium leading-6 text-gray-900 mb-2">
          Ministry
        </label>
        <select
          value={selectedMinistry}
          onChange={handleMinistryChange}
          className={baseClassName}
        >
          <option value="" disabled>
            Select Ministry
          </option>
          {ministryOptions.map((ministry) => (
            <option key={ministry} value={ministry}>
              {ministry}
            </option>
          ))}
        </select>
      </div>

      {/* Division Dropdown */}
      <div>
        <label className="block font-medium leading-6 text-gray-900 mb-2">
          Division
        </label>
        <select
          value={selectedDivision}
          onChange={handleDivisionChange}
          className={baseClassName}
          disabled={!selectedMinistry}
        >
          <option value="" disabled>
            {selectedMinistry ? "Select Division" : "Select a Ministry first"}
          </option>
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      {/* Branch/Unit Dropdown */}
      {displayBranch && (
        <div>
          <label className="block font-medium leading-6 text-gray-900 mb-2">
            Branch/Unit
          </label>
          <select
            value={selectedBranch}
            onChange={handleBranchChange}
            className={baseClassName}
            disabled={!selectedDivision}
          >
            <option value="" disabled>
              {selectedDivision
                ? "Select Branch/Unit"
                : "Select a Division first"}
            </option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
