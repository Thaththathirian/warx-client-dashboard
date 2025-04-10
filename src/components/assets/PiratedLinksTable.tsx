
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAssetStore } from '@/store/assetStore';
import { File, FileText, Link } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PiratedLinksTable = () => {
  const { assetDetail } = useAssetStore();

  if (!assetDetail) {
    return null;
  }

  const hasDetections = assetDetail.count.detected && assetDetail.count.detected.length > 0;
  const hasEnforcements = assetDetail.count.enforced && assetDetail.count.enforced.length > 0;
  const hasRemovals = assetDetail.count.removed && assetDetail.count.removed.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link className="h-5 w-5 mr-2" />
          Pirated Content Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasDetections && !hasEnforcements && !hasRemovals ? (
          <div className="flex justify-center items-center p-6">
            <p className="text-muted-foreground">No pirated links data available</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Link Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasDetections && assetDetail.count.detected.map((item, index) => (
                <TableRow key={`detected-${index}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {item.icon ? (
                        <img src={item.icon} alt={item.name} className="h-4 w-4 mr-2" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" style={{ color: item.color_code }} />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                      Detected
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.link_count.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              
              {hasEnforcements && assetDetail.count.enforced.map((item, index) => (
                <TableRow key={`enforced-${index}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {item.icon ? (
                        <img src={item.icon} alt={item.name} className="h-4 w-4 mr-2" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" style={{ color: item.color_code }} />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      Enforced
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.link_count.toLocaleString()}</TableCell>
                </TableRow>
              ))}
              
              {hasRemovals && assetDetail.count.removed.map((item, index) => (
                <TableRow key={`removed-${index}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {item.icon ? (
                        <img src={item.icon} alt={item.name} className="h-4 w-4 mr-2" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" style={{ color: item.color_code }} />
                      )}
                      {item.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
                      Removed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{item.link_count.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PiratedLinksTable;
