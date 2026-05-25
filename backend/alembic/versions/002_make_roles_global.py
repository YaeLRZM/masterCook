"""Make roles global instead of tenant-scoped.

Revision ID: 002make_roles_global
Revises: 6ff0a6185b41
Create Date: 2026-05-25
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002make_roles_global'
down_revision = '6ff0a6185b41'
branch_labels = None
depends_on = None


def upgrade():
    # Primero eliminamos la constraint única antigua
    op.drop_constraint('uq_rol_empresa_nombre', 'roles', type_='unique')

    # Eliminamos la columna empresa_id (que incluye su foreign key automáticamente)
    op.drop_column('roles', 'empresa_id')

    # Agregamos constraint única en nombre
    op.create_unique_constraint('uq_rol_nombre', 'roles', ['nombre'])


def downgrade():
    # Revertir: agregar empresa_id de vuelta
    op.drop_constraint('uq_rol_nombre', 'roles', type_='unique')

    op.add_column('roles', sa.Column('empresa_id', sa.Integer(), nullable=False))
    op.create_foreign_key('fk_roles_empresa_id', 'roles', 'empresas', ['empresa_id'], ['id'])
    op.create_unique_constraint('uq_rol_empresa_nombre', 'roles', ['empresa_id', 'nombre'])
