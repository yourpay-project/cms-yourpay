import * as React from 'react';

import { cn } from '@/shared/lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  ref?: React.Ref<HTMLTableElement>;
}

/** Semantic table primitives (shadcn-style) for data tables. Use with DataTable or raw markup. */
const Table: React.FC<TableProps> = ({ className, ref, ...props }) => (
  <table
    ref={ref}
    className={cn(
      'w-full caption-bottom text-sm text-foreground',
      className,
    )}
    {...props}
  />
);
Table.displayName = 'Table';

interface TableSectionProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  ref?: React.Ref<HTMLTableSectionElement>;
}

const TableHeader: React.FC<TableSectionProps> = ({ className, ref, ...props }) => (
  <thead
    ref={ref}
    className={cn('[&_tr]:border-b border-border/60 bg-muted/50', className)}
    {...props}
  />
);
TableHeader.displayName = 'TableHeader';

const TableBody: React.FC<TableSectionProps> = ({ className, ref, ...props }) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
);
TableBody.displayName = 'TableBody';

const TableFooter: React.FC<TableSectionProps> = ({ className, ref, ...props }) => (
  <tfoot
    ref={ref}
    className={cn(
      'bg-muted/50 font-medium text-muted-foreground',
      className,
    )}
    {...props}
  />
);
TableFooter.displayName = 'TableFooter';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  ref?: React.Ref<HTMLTableRowElement>;
}

const TableRow: React.FC<TableRowProps> = ({ className, ref, ...props }) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-border/60 transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted/50',
      className,
    )}
    {...props}
  />
);
TableRow.displayName = 'TableRow';

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>;
}

const TableHead: React.FC<TableHeadProps> = ({ className, ref, ...props }) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground',
      className,
    )}
    {...props}
  />
);
TableHead.displayName = 'TableHead';

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  ref?: React.Ref<HTMLTableCellElement>;
}

const TableCell: React.FC<TableCellProps> = ({ className, ref, ...props }) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle text-sm text-muted-foreground', className)}
    {...props}
  />
);
TableCell.displayName = 'TableCell';

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  ref?: React.Ref<HTMLTableCaptionElement>;
}

const TableCaption: React.FC<TableCaptionProps> = ({ className, ref, ...props }) => (
  <caption
    ref={ref}
    className={cn('mt-4 text-sm text-muted-foreground', className)}
    {...props}
  />
);
TableCaption.displayName = 'TableCaption';

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
