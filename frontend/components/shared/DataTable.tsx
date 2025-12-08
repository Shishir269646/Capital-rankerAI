"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Pagination } from "./Pagination";

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, row: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onSort?: (key: string) => void;
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export function DataTable<T extends { id: string }>({
    data,
    columns,
    onSort,
    currentPage,
    totalPages,
    onPageChange,
}: DataTableProps<T>) {
    return (
        <div className="space-y-4" >
            <div className="border rounded-lg" >
                <Table>
                    <TableHeader>
                        <TableRow>
                            {
                                columns.map((column) => (
                                    <TableHead key={String(column.key)
                                    } >
                                        {
                                            column.sortable ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => onSort?.(String(column.key))
                                                    }
                                                    className="hover:bg-transparent"
                                                >
                                                    {column.label}
                                                    < ArrowUpDown className="ml-2 h-4 w-4" />
                                                </Button>
                                            ) : (
                                                column.label
                                            )}
                                    </TableHead>
                                ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No data available
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((row) => (
                                    <TableRow key={row.id} >
                                        {
                                            columns.map((column) => {
                                                const value = row[column.key as keyof T];
                                                return (
                                                    <TableCell key={String(column.key)
                                                    } >
                                                        {column.render ? column.render(value, row) : String(value)}
                                                    </TableCell>
                                                );
                                            })}
                                    </TableRow>
                                ))
                            )}
                    </TableBody>
                </Table>
            </div>

            {
                currentPage && totalPages && onPageChange && totalPages > 1 && (
                    <div className="flex justify-center" >
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                        />
                    </div>
                )
            }
        </div>
    );
}
