import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { CancelOutlined } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultipleSelectChip = ({
  userNames,
  setTaggedPersonId,
  personName,
  setPersonName,
}) => {
  useEffect(() => {

    setTaggedPersonId(personName?.map((name) => name.id));
  }, [personName, setTaggedPersonId]);

  return (
    <Box sx={{ width: "100%" }}>
      <FormControl sx={{ m: 1, width: "100%" }}>
        <InputLabel id="demo-multiple-chip-label">Tag a person</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={(e) => {
            setPersonName(e.target.value);
          }}
          input={
            <OutlinedInput id="select-multiple-chip" label="Tag a person" />
          }
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((user) => (
                <Chip
                  key={user.id}
                  label={`${user.firstName} ${user.lastName}`}
                  onDelete={() => {
                    setPersonName((state) =>
                      state.filter((name) => name.id !== user.id)
                    );
                  }}
                  deleteIcon={
                    <CancelOutlined
                      onMouseDown={(event) => event.stopPropagation()}
                    />
                  }
                />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {userNames?.map((user) => (
            <MenuItem key={user.id} value={user}>
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MultipleSelectChip;
