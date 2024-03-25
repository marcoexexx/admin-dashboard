import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

const WIDTHS = [220, 180, 140, 200];
const ROWS = 3;
const COLUMNS = WIDTHS.length;

function getRandomWidth() {
  return WIDTHS[Math.floor(Math.random() * WIDTHS.length)];
}

export interface LoadingTablePlaceholderProps {
}

export function LoadingTablePlaceholder(
  props: LoadingTablePlaceholderProps,
) {
  const {} = props;
  return (
    <Table>
      <TableHead>
        <TableRow>
          {[...Array(COLUMNS).keys()].map(key => (
            <TableCell key={key}>
              <Skeleton width={WIDTHS[key]} height={35} />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>

      <TableBody>
        {[...Array(ROWS).keys()].map(key => (
          <TableRow key={key}>
            {[...Array(COLUMNS).keys()].map(key => (
              <TableCell key={key}>
                <Skeleton width={getRandomWidth()} height={30} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
