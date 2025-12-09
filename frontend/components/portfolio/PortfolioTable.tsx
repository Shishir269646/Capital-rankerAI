import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";

interface PortfolioCompany {
    id: string;
    name: string;
    sector: string;
    invested: number;
    value: number;
    multiple: number;
    status: "active" | "exited";
}

interface PortfolioTableProps {
    companies: PortfolioCompany[];
}

export function PortfolioTable({ companies }: PortfolioTableProps) {
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead className="text-right">Invested</TableHead>
                        <TableHead className="text-right">Current Value</TableHead>
                        <TableHead className="text-right">Multiple</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {companies.map((company) => (
                        <TableRow key={company.id}>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{company.sector}</TableCell>
                            <TableCell className="text-right">{formatCurrency(company.invested)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(company.value)}</TableCell>
                            <TableCell className="text-right">{company.multiple}x</TableCell>
                            <TableCell>
                                <Badge variant={company.status === "active" ? "default" : "secondary"}>
                                    {company.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button variant="ghost" size="sm">View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
