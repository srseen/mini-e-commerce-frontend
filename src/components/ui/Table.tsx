import React from 'react';
import { cn } from '../../lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className, ...props }) => (
  <div className="overflow-x-auto">
    <table className={cn('min-w-full divide-y divide-gray-200', className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => (
  <thead className={cn('bg-gray-50', className)} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => (
  <tbody className={cn('bg-white divide-y divide-gray-200', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => (
  <tr className={cn('hover:bg-gray-50', className)} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => (
  <th
    className={cn(
      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const TableCell: React.FC<TableCellProps> = ({ children, className, ...props }) => (
  <td className={cn('px-6 py-4 whitespace-nowrap text-sm text-gray-900', className)} {...props}>
    {children}
  </td>
);