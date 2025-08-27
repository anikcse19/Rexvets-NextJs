import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { HelpModel } from "@/models";

/**
 * POST /api/help/migrate
 * 
 * Migration script to update existing help documents from isActive to status field
 * This should be run once to migrate existing data
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Find all documents that still have isActive field
    const documentsToMigrate = await HelpModel.find({
      $or: [
        { isActive: { $exists: true } },
        { status: { $exists: false } }
      ]
    });

    console.log(`Found ${documentsToMigrate.length} documents to migrate`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const doc of documentsToMigrate) {
      try {
        // Determine the new status based on isActive value
        const newStatus = doc.isActive === false ? 'completed' : 'pending';
        
        // Update the document
        await HelpModel.findByIdAndUpdate(doc._id, {
          $set: {
            status: newStatus,
            updatedAt: new Date()
          },
          $unset: {
            isActive: 1
          }
        });

        migratedCount++;
        console.log(`Migrated document ${doc._id}: isActive=${doc.isActive} -> status=${newStatus}`);
      } catch (error) {
        console.error(`Error migrating document ${doc._id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed",
      data: {
        totalDocuments: documentsToMigrate.length,
        migratedCount,
        errorCount,
        summary: `Successfully migrated ${migratedCount} documents. ${errorCount} errors occurred.`
      }
    });

  } catch (error: any) {
    console.error("Migration error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Migration failed",
        errorCode: "MIGRATION_ERROR",
        errors: { message: error.message },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/help/migrate
 * 
 * Check migration status - shows how many documents need migration
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Count documents with old isActive field
    const oldFormatCount = await HelpModel.countDocuments({
      isActive: { $exists: true }
    });

    // Count documents with new status field
    const newFormatCount = await HelpModel.countDocuments({
      status: { $exists: true }
    });

    // Count total documents
    const totalCount = await HelpModel.countDocuments({});

    return NextResponse.json({
      success: true,
      message: "Migration status",
      data: {
        totalDocuments: totalCount,
        oldFormatDocuments: oldFormatCount,
        newFormatDocuments: newFormatCount,
        needsMigration: oldFormatCount > 0,
        migrationStatus: oldFormatCount === 0 ? "Complete" : "Pending"
      }
    });

  } catch (error: any) {
    console.error("Migration status check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check migration status",
        errorCode: "STATUS_CHECK_ERROR",
        errors: { message: error.message },
      },
      { status: 500 }
    );
  }
}
